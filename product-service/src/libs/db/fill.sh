#!/bin/sh

aws dynamodb batch-write-item --request-items file://productsTable.json --region eu-west-1
aws dynamodb batch-write-item --request-items file://stocksTable.json --region eu-west-1