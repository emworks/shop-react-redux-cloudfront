import crypto from 'crypto'
import AWS from 'aws-sdk'
import type { FromSchema } from "json-schema-to-ts";
import schema from '@functions/createProduct/schema';

const dynamo = new AWS.DynamoDB.DocumentClient()

export const createProductTransaction = async (data: FromSchema<typeof schema>) => {
    const { count, ...item } = data

    const id = crypto.randomUUID()

    await dynamo.transactWrite({
        TransactItems: [
            {
                Put: {
                    TableName: process.env.PRODUCTS_TABLE_NAME,
                    Item: { id, ...item }
                },
            },
            {
                Put: {
                    TableName: process.env.STOCKS_TABLE_NAME,
                    Item: {
                        product_id: id,
                        count
                    }
                },
            },
        ],
    }).promise()
}

export const sendSNSMessage = async (params: AWS.SNS.PublishInput, callback = async (err, data) => console.log(err, data)) => {
    const sns = new AWS.SNS()
    return await sns.publish(params, callback).promise()
}