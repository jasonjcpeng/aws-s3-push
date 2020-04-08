const Upload = require('./src/upload');
const check = require('check-types');

class index {
  constructor({
    bucketName = '',
    bucketDir = '',
    cachePath = '',
    region = '',
    accessKeyId = '',
    secretAccessKey = '',
  }) {
    this.params = {
      bucketName,
      bucketDir,
      cachePath,
      region,
      accessKeyId,
      secretAccessKey,
    }
    this.checkParams();
    this.Up = new Upload(this.params);
  }

  async upload(dir) {
    check.assert(check.nonEmptyString(dir), `upload() function params 'dir' is required`);
    return await this.Up.upload(dir);
  }

  clearCache() {

    this.Up.clearCache();
  }

  checkParams() {
    Object.keys(this.params).map(item => {
      check.assert(check.containsKey(this.params, item), `constructor params [${item}] is required`);
    })
  }

}

module.exports = index;