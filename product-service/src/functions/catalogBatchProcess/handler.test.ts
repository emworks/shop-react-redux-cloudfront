
import { catalogBatchProcess } from './handler'
import * as utils from 'src/utils'

describe('/catalogBatchProcess', () => {
    const products = [
        { id: 1, title: 'product 1' },
        { id: 2, title: 'product 2' },
    ]

    const generateSQSEvent = (): any => ({
        Records: products.map((product) => ({ body: JSON.stringify(product) }))
    })

    test('success response', async () => {
        const createProductTransactionSpy = jest.spyOn(utils, 'createProductTransaction').mockResolvedValue(undefined)
        const sendSNSMessageSpy = jest.spyOn(utils, 'sendSNSMessage').mockResolvedValue(undefined)

        await catalogBatchProcess(generateSQSEvent(), null, null)
        
        expect(utils.createProductTransaction).toHaveBeenCalledTimes(products.length)
        expect(utils.sendSNSMessage).toHaveBeenCalledTimes(1)

        createProductTransactionSpy.mockClear()
        sendSNSMessageSpy.mockClear()
    })

    test('error response', async () => {
        jest.spyOn(utils, 'createProductTransaction').mockRejectedValue(undefined)
        jest.spyOn(utils, 'sendSNSMessage').mockResolvedValue(undefined)

        await catalogBatchProcess(generateSQSEvent(), null, null)
        
        expect(utils.createProductTransaction).toHaveBeenCalledTimes(products.length)
        expect(utils.sendSNSMessage).not.toHaveBeenCalled()
    })
});