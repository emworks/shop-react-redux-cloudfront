import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors';

import schema from './schema';
import { createProductTransaction } from 'src/utils';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log('event', event)

    try {
        const { count, ...item } = event.body
        await createProductTransaction(event.body)
        return formatJSONResponse({ ...item, count })
    } catch (err) {
        return formatJSONResponse({ message: err.message }, 400)
    }
};

export const main = middyfy(createProduct).use(cors());
