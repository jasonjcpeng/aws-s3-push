const fstream = require('fstream');
const fs = require('fs');

class Cache {
  constructor({
    cachePath = '',
    bucketName = ''
  }) {
    this.cachePath = cachePath;
    this.bucketName = `asp-cache-${bucketName}`;
  }


  readCache() {
    let result = '';
    try {
      result = fs.readFileSync(`${this.cachePath}\\${this.bucketName}`)
    } catch (error) {
      result = undefined
    }
    return result;
  }

  async writeCache() {
    const self = this;
    if (!this.readCache()) {
      this.deleteCache();
    }
    const cacheFile = this.readCache();
    const File = JSON.parse(cacheFile.toString());

    const result = {
      add({
        path = ''
      }) {
        File[path] = true;
        return result;
      },
      do() {
        fstream.Writer({
          path: `${self.cachePath}${self.bucketName}`
        }).write(JSON.stringify(File));
        return 1
      }
    }

    return result
  }

  deleteCache() {
    fs.writeFileSync(`${this.cachePath}\\${this.bucketName}`, '{}')
  }

  isFileDiff({
    path = '',
  }) {
    const cacheFile = this.readCache();
    const File = JSON.parse(cacheFile.toString());
    if (File[path]) return false;
    return true
  }
}

module.exports = Cache;
