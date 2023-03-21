import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            sqs: {
                arn: {
                    'Fn::GetAtt': ['SQSQueue', 'Arn']
                },
                batchSize: 5
            }
        },
    ],
    environment: {
        PRODUCTS_TABLE_NAME: 'productsTable',
        STOCKS_TABLE_NAME: 'stocksTable',
        SNS_ARN: {
            Ref: 'SNSTopic'
        }
    }
};
