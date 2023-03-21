import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import { s3BucketName } from 'src/constants';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    httpApi: {
      cors: true,
    },
    region: 'eu-west-1',
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:ListBucket"
            ],
            Resource: "arn:aws:s3:::${self:custom.s3BucketName}"
          },
          {
            Effect: "Allow",
            Action: [
              "s3:*"
            ],
            Resource: "arn:aws:s3:::${self:custom.s3BucketName}/*"
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: 'arn:aws:sqs:eu-west-1:854170183769:catalogItemsQueue'
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    s3BucketName,
    autoswagger: {
      apiType: 'http',
      basePath: '/${sls:stage}'
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      importBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: '${self:custom.s3BucketName}',
          AccessControl: "PublicRead",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT'],
                AllowedOrigins: ['*'],
                Id: 'CORSRuleId1',
                MaxAge: '3600'
              }
            ]
          }
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;
