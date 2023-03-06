import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk'

const dynamo = new AWS.DynamoDB.DocumentClient()

import schema from './schema';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const { Items: products } = await dynamo.scan({
      TableName: process.env.PRODUCTS_TABLE_NAME
    }).promise()

    const { Items: stocks } = await dynamo.scan({
      TableName: process.env.STOCKS_TABLE_NAME
    }).promise()

    const stockMap = new Map([...stocks].map((stock) => [stock.product_id, stock.count]));

    const items = [...products].reduce((memo: any[], item) => [...memo, { ...item, count: stockMap.get(item.id) }], [])

    return formatJSONResponse(items)
  } catch (err) {
    return formatJSONResponse({message: err.message}, 400)
  }
};

export const main = middyfy(getProductsList).use(cors());
