# aws-s3-push
A module for aws s3 cdn push with cache

## Installation
``` javascript
  npm i aws-s3-push --save-dev
```

## Use it
``` javascript
  const awsS3Push = require('aws-s3-push');
  const rootPath = './dist'; // that means /dist/* all file and child dir file
 

  const push = new awsS3Push({
    bucketName,
    bucketDir,
    cachePath,
    region,
    accessKeyId, 
    secretAccessKey, 
  });

  push.upload(rootPath); 

  // or use async/await to get the upload result
  const result = await push.upload(rootPath); // if success,result will be 1
  

```

### Api

#### constructor params
- **bucketName**:{string} s3 bucketName
- **bucketDir**:{string} s3 bucketRootDir
- **cachePath**:{string} the cache file path
- **region**:{string} s3 region
- **accessKeyId**:{string} s3 ACCESS_KEY 
- **secretAccessKey**:{string} s3 ACCESS_SECRET

#### method params
- **upload(path)**: sync upload to s3
  - **path**: the file dir you want push to s3 bucket. 
- **clearCache()**: clear cache file


