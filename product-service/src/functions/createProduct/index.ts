import schema from "./schema";
import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products',
                cors: true,
                request: {
                    schemas: {
                        "application/json": schema,
                    },
                },
            },
        },
    ],
    environment: {
        PRODUCTS_TABLE_NAME: 'productsTable',
        STOCKS_TABLE_NAME: 'stocksTable',
    }
};
