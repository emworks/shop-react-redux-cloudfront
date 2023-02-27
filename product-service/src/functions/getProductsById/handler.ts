import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';

import schema from './schema';

import { body } from './mock.json'

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const data = JSON.parse(body)
  const product = data.find(({ id }) => id === event.pathParameters.productId)
  if (!product) {
    return await formatJSONResponse({message: 'Product not found'}, 404);
  }
  return await formatJSONResponse(product);
};

export const main = middyfy(getProductsById).use(cors());
