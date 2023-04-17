import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: 'arn:aws:lambda:eu-west-1:854170183769:function:authorization-service-dev-basicAuthorizer',
          resultTtlInSeconds: 0,
          type: 'request'
        },
      },
    },
  ],
};
