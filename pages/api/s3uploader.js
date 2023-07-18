const AWS = require('aws-sdk');
import axios from 'axios';
import React from 'react';

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_S3_BUCKET_REGION,
  signatureVersion: 'v4',
});

export default async function aws(file) {
  try {
    const fileParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: file.name,
      Expires: 600,
      ContentType: file.type,
    };
    const url = await s3.getSignedUrlPromise('putObject', fileParams);
    console.log('DataURL:', url);

    const data = await axios.put(url, file, {
      headers: {
        'Content-type': String(file.type),
      },
    });
    console.log('Datum:', data);

    const uploadedImageUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_BUCKET_REGION}.amazonaws.com/${file.name}`;
    console.log('Uploaded Image URL:', uploadedImageUrl);

    return uploadedImageUrl;
  } catch (error) {
    return error;
  }
}
