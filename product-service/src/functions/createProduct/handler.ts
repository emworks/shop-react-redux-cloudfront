import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk'

const dynamo = new AWS.DynamoDB.DocumentClient()

import schema from './schema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const item = event.body

        await dynamo.put({
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: item
        }).promise()

        await dynamo.put({
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: {
                product_id: item.id,
                count: 1
            }
          }).promise()

        return formatJSONResponse(item)
    } catch (err) {
        return formatJSONResponse({ message: err.message }, 400)
    }
};

export const main = middyfy(createProduct).use(cors());
