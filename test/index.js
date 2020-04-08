const Path = require('path');
const assert = require('chai').assert;
const root = Path.join(__dirname, '../');

// params----------
const { bucketName, accessKeyId, secretAccessKey, region } = require(`./config/index`);
const bucketDir = 'dist';
const rootPath = Path.join(__dirname, './filepath');
const filePath = Path.join(__dirname, './filepath/test.js');
const cachePath = Path.join(__dirname, './');
// --------------


const Index = require(`${root}/index.js`);
const upload = require(`${root}/src/upload.js`);
const cache = require(`${root}/src/cache.js`)


describe('#Index > /index.js', () => {
  const index = new Index({
    bucketName,
    bucketDir,
    cachePath,
    region,
    accessKeyId,
    secretAccessKey,
  });

  it('index.upload()', async function () {
    this.timeout(10000);
    const result = await index.upload(rootPath);
    assert.equal(result, 1);
  })

  it('index.clearCache()', () => {
    index.clearCache();
  })

  it('index.checkParams()', () => {
    index.checkParams();
  })
})



describe('#Upload > /src/upload.js', () => {
  const Upload = new upload({
    bucketName,
    bucketDir,
    region,
    accessKeyId,
    secretAccessKey,
  });

  // upload.upload()
  it('upload.upload()', async function () {
    this.timeout(10000);
    const result = await Upload.upload(rootPath);
    assert.equal(result, 1);
  })

  // upload.s3Upload()
  it('upload.s3Upload()', async function () {
    this.timeout(10000);
    const result = await Upload.s3Upload(rootPath, filePath);
    assert.equal(result, 1);
  })
})





describe('#Cache > /src/cache.js', () => {
  const Cache = new cache({ bucketName, cachePath });

  it('cache.readCache()', async () => {
    const result = Cache.readCache();
    assert.equal(result, 1)
  })

  it('cache.writeCache()', async () => {
    const result = Cache.writeCache().add({ path: filePath }).add({ path: 'ccc' }).add({ path: 'vvv' }).do();
    assert.equal(result, 1)
  })

  it('cache.deleteCache()', async () => {
    Cache.deleteCache();
  })

  it('cache.isFileDiff()', async () => {
    const result = Cache.isFileDiff({ path: filePath });
    assert.equal(result, false)
  })
})

