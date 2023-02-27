import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';

import schema from './schema';

import { body } from './mock.json'

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const data = JSON.parse(body)
  return await formatJSONResponse(data);
};

export const main = middyfy(getProductsList).use(cors());
