export default {
    type: "object",
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        count: { type: 'number' }
    },
} as const;