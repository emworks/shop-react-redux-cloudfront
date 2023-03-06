import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';
import crypto from 'crypto'
import AWS from 'aws-sdk'

const dynamo = new AWS.DynamoDB.DocumentClient()

import schema from './schema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log('event', event)

    try {
        const { count, ...item } = event.body
        
        const id = crypto.randomUUID()

        await dynamo.put({
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: { id, ...item }
        }).promise()

        await dynamo.put({
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: {
                product_id: id,
                count
            }
        }).promise()

        return formatJSONResponse({ ...item, count })
    } catch (err) {
        return formatJSONResponse({ message: err.message }, 400)
    }
};

export const main = middyfy(createProduct).use(cors());
