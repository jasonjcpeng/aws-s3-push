const AWS = require('aws-sdk')
const zlib = require('zlib');
const fstream = require('fstream');
const mime = require('mime-types');
const dir = require('node-dir');
const cache = require('./cache');


/**
 * @constructor
  {
  bucketName,
  bucketDir,
  cachePath,
  region,
  accessKeyId,
  secretAccessKey,
  }
 * 
 */


class Upload {
  constructor(config) {
    this.config = config;
    this.cache = new cache({ bucketName: config.bucketName || '', cachePath: config.cachePath || '' });
    this.s3Node = new AWS.S3({
      bucketName: config.bucketName || '',
      bucketDir: config.bucketDir || '',
      region: config.region || '',
      accessKeyId: config.accessKeyId || '',
      secretAccessKey: config.secretAccessKey || '',
    });
  }

  clearCache() {
    this.cache.deleteCache();
  }


  async upload(path) {
    const cacheWriter = await this.cache.writeCache();
    const dirAll = await dir.promiseFiles(path);
    const failPath = [];
    return new Promise((res, rej) => {
      Promise.all(dirAll.map(async (item) => {
        return new Promise(async (resolve, reject) => {
          const result = await this.s3Upload(path, item, cacheWriter);
          if (result !== 1) {
            failPath.push(item);
            reject(0)
          }
          resolve(1);
        })
      })).then(e => {
        cacheWriter.do();
        res(1);
      }).catch(err => {
        console.log(`[S3 Upload Error at]`, failPath);
        rej(err);
      });
    });
  }

  async s3Upload(rootPath, filePath, cacheWriter) {

    const pathArr = encodeURIComponent(filePath).split(`${encodeURIComponent(rootPath)}`);

    const stream = fstream.Reader(filePath).pipe(zlib.createGzip());

    const mimeType = mime.lookup(filePath);

    const pathReal = decodeURIComponent(pathArr[1]).replace(/\\/g, '/');

    const params = { ...this.config.s3Params, Bucket: this.config.bucketName, Key: `${this.config.bucketDir}${pathReal}`, Body: stream, ContentEncoding: 'gzip', ContentType: mimeType || undefined };

    return new Promise((res, rej) => {
      const startTime = Date.now();

      if (!cacheWriter.isFileDiff({ path: pathReal })) {
        console.log(`[S3 Upload Success - at Cache]`, pathReal);
        res(1);
        return;
      }

      this.s3Node.upload(params, function (err, data) {
        if (err) {
          rej(err);
        }
        if (data && data.ETag) {
          cacheWriter.add({ path: pathReal });
          console.log(`[S3 Upload Success - ${(Date.now() - startTime)} ms]`, data.Location);
          res(1);
        }

        if (!err && !data) {
          console.log(`[S3 Upload unknown - key: ${params.Key} /ContentType:${params.mimeType}]`);
        }

      })
    })

  }
}

module.exports = Upload;


