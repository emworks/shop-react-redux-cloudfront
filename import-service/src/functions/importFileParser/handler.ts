import type { ValidatedEventS3Event } from '@libs/s3';
import AWS from 'aws-sdk';

import csv from 'csv-parser'
import { s3BucketKey, s3BucketParsedKey } from 'src/constants';

const importFileParser: ValidatedEventS3Event = async (event) => {
  console.log('event', event)

  const s3 = new AWS.S3()
  const sqs = new AWS.SQS()

  for (const record of event.Records) {
    const Bucket = record.s3.bucket.name;
    const Key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const params = { Bucket, Key };
    const stream = s3.getObject(params).createReadStream();

    const parser = stream.pipe(csv())

    try {
      for await (const data of parser) {
        sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data),
        }, (err, data) => console.log(err, data))

        await s3.copyObject({
          Bucket,
          CopySource: `${Bucket}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace(s3BucketKey, s3BucketParsedKey)
        }).promise()

        await s3.deleteObject({
          Bucket,
          Key: record.s3.object.key
        }).promise()
      }
    } catch (error) {
      console.error(error);
    }

    console.log(`Parsed`);
  }
};

export const main = importFileParser
