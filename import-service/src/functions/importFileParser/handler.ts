import type { ValidatedEventS3Event } from '@libs/s3';
import AWS from 'aws-sdk';

import csv from 'csv-parser'

const importFileParser: ValidatedEventS3Event = async (event) => {
  console.log('event', event)

  const s3 = new AWS.S3()

  const promises = event.Records.map((record) => {
    const Bucket = record.s3.bucket.name;
    const Key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const params = { Bucket, Key };
    const stream = s3.getObject(params).createReadStream();

    return new Promise(function (resolve, reject) {
      stream.pipe(csv())
        .on('data', (data) => {
          console.log(data);
        })
        .on('error', (error) => {
          console.error(error);
          reject(error);
        })
        .on('end', (rows) => {
          console.log(`Parsed ${rows} rows`);
          resolve(rows);
        });
    });
  });

  return Promise.all(promises);
};

export const main = importFileParser
