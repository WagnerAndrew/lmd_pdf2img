const util = require('util');
const AWS = require('aws-sdk');
const gm = require('gm').subClass({ imageMagick: true });
const s3 = new AWS.S3();

exports.handler = (event, context) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  const dstBucket = srcBucket;
  const dstKey = srcKey.replace('.pdf', '.png');

  s3.getObject({Bucket: srcBucket, Key: srcKey}, (err, response) => {
    if (err) {
      context.done('S3 get object error:', err);
      context.fail(err);
    }

    // conversion start
    gm(response.Body)
      .setFormat("png")
      .resize(200) // you can configure
      .quality(100) // you can configure
      .stream((err, stdout, stderr) => {
        if(err) {
          console.log("gm conversion process error: ");
          console.log(err,stdout,stderr);
          context.fail(err);
        }
        const chunks = [];
        stdout.on('data', (chunk) => {
          chunks.push(chunk);
        });
        stdout.on('end', () => {
          console.log('gm process finished');
          const buffer = Buffer.concat(chunks);

          // Upload start
          const params = {
            Bucket: dstBucket,
            Key: dstKey,
            ContentType: 'image/png',
            Body: buffer
          };
          s3.putObject(params, (err, data) => {
            if (err) {
              console.log("S3 upload error: " + err);
              context.fail(err);
            }
            console.log('S3 upload finished!');
            console.log('Bucket: ' + dstBucket);
            console.log('key: ' + dstKey);
            context.succeed({
              "error":false
            });
          });
        });

        stderr.on('data', (data) => {
          console.log('stderr data: ' +  data);
        });
      });
  });
};
