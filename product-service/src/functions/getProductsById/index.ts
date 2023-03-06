import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true
      },
    },
  ],
  environment: {
    PRODUCTS_TABLE_NAME: 'productsTable',
    STOCKS_TABLE_NAME: 'stocksTable',
  }
};
