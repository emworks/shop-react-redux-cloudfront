import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';
import AWS from "aws-sdk";
import { s3BucketKey, s3BucketName } from 'src/constants';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('event', event)

  try {
    const s3 = new AWS.S3({
      signatureVersion: 'v4'
    })

    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: s3BucketName,
      Key: `${s3BucketKey}${event.queryStringParameters.name}`,
      Expires: 60 * 5
    })

    return formatJSONResponse({
      signedUrl,
    });
  } catch (err) {
    return formatJSONResponse({ message: err.message }, 400)
  }
};

export const main = middyfy(importProductsFile).use(cors())
