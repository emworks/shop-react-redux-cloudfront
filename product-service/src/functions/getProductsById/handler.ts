import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk'

const dynamo = new AWS.DynamoDB.DocumentClient()

import schema from './schema';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('event', event)
  
  const { productId } = event.pathParameters

  try {
    const { Items: products } = await dynamo.query({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': productId }
    }).promise()

    if (!products[0]) {
      return formatJSONResponse({message: 'Product not found'}, 404);
    }

    const { Items: stocks } = await dynamo.query({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: 'product_id = :product_id',
      ExpressionAttributeValues: { ':product_id': products[0].id }
    }).promise()

    return formatJSONResponse({
      ...products[0],
      count: stocks[0].count
  })
  } catch (err) {
    return formatJSONResponse({message: err.message}, 400)
  }
};

export const main = middyfy(getProductsById).use(cors());
