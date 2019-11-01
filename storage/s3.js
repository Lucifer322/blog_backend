require("dotenv").config();
const fs = require("fs");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});

const uploadFile = async path => {
  const file = fs.readFileSync(path);
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: new Date().toString(),
    Body: file
  };

  const uploadPromise = new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      if (err) {
        reject(err);
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      resolve(data.Location);
    });
  });
  return uploadPromise;
};

module.exports = {
  uploadFile
};
