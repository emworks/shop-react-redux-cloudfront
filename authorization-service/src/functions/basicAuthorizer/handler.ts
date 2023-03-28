import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent, PolicyDocument } from "aws-lambda";

enum Effect {
    Allow = 'Allow',
    Deny = 'Deny'
}

const generatePolicyDocument = (effect: Effect, resource: string): PolicyDocument => ({
    Version: '2012-10-17',
    Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
    }]
})

const generateResponse = (principalId: string, effect: Effect, resource: string): APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: generatePolicyDocument(effect, resource)
})

const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult | string> => {
    console.log('event', event)

    const { headers, methodArn } = event

    if (!headers.Authorization) {
        throw 'Unauthorized'
    }

    const encodedCreds = headers.Authorization.split(' ')[1]
    const buff = Buffer.from(encodedCreds, 'base64')
    const [username, password] = buff.toString('utf-8').split(':')

    const response = process.env[username] && process.env[username] === password 
        ? generateResponse(encodedCreds, Effect.Allow, methodArn)
        : generateResponse(encodedCreds, Effect.Deny, methodArn)

    console.log('response', JSON.stringify(response))

    return response
};

export const main = basicAuthorizer;
