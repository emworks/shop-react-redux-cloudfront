
import { getProductsById } from './handler'

describe('/getProductsById', () => {
    const generateProductIdProxyEvent = (productId: string): any => ({
        pathParameters: {
            productId
        }
    })
    
    test('success response', async () => {
        const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
        const response = await getProductsById(generateProductIdProxyEvent(productId), null, null)
        if (response) {
            const body = JSON.parse(response.body)
            expect(response.statusCode).toBe(200);
            expect(body).toHaveProperty('id');
        }
    })

    test('error not found response', async () => {
        const productId = '123456789'
        const response = await getProductsById(generateProductIdProxyEvent(productId), null, null)
        if (response) {
            const body = JSON.parse(response.body)
            expect(response.statusCode).toBe(404);
            expect(body).not.toHaveProperty('id');
        }
    })
});