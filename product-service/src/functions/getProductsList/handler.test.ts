
import { getProductsList } from './handler'

describe('/getProductsList', () => {
    test('success response', async () => {
        const response = await getProductsList(null, null, null)
        if (response) {
            const body = JSON.parse(response.body)
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(body)).toBe(true);
        }
    })
});