import { ValidatedEventSQSEvent } from '@libs/sqs';
import { createProductTransaction, sendSNSMessage } from 'src/utils';

export const catalogBatchProcess: ValidatedEventSQSEvent = async (event) => {
    console.log('event', event)

    try {
        const products = []
        const productsPromise = []

        event.Records.forEach(async ({ body }) => {
            const item = JSON.parse(body)
            products.push(item)
            productsPromise.push(createProductTransaction(item))
        })

        await Promise.all(productsPromise)

        await sendSNSMessage({
            Subject: 'Products have been created',
            Message: JSON.stringify(products),
            TopicArn: process.env.SNS_ARN
        })
    } catch (err) {
        console.log(err)
    }
};

export const main = catalogBatchProcess;
