import { handlerPath } from '@libs/handler-resolver';
import { s3BucketKey, s3BucketName } from 'src/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: s3BucketName,
        event: "s3:ObjectCreated:*",
        rules: [
          {
            prefix: s3BucketKey
          }
        ],
        existing: true
      },
    },
  ],
  environment: {
    // TODO: take that from products-service
    SQS_URL: 'https://sqs.eu-west-1.amazonaws.com/854170183769/catalogItemsQueue',
  }
};
