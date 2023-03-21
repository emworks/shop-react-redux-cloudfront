import AWS from 'aws-sdk'
import { ValidatedEventSQSEvent } from '@libs/sqs';
import { createProductTransaction } from 'src/utils';

export const catalogBatchProcess: ValidatedEventSQSEvent = async (event) => {
    console.log('event', event)

    const sns = new AWS.SNS()

    try {
        const products = []
        const productsPromise = []

        event.Records.forEach(async ({ body }) => {
            const item = JSON.parse(body)
            products.push(item)
            productsPromise.push(createProductTransaction(item))
        })

        await Promise.all(productsPromise)

        await sns.publish({
            Subject: 'Products have been created',
            Message: JSON.stringify(products),
            TopicArn: process.env.SNS_ARN
        }, async (err, data) => console.log(err, data)).promise()
    } catch (err) {
        console.log(err)
    }
};

export const main = catalogBatchProcess;
