const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Order Service API', version: '1.0.0', description: 'Order management microservice' },
        servers: [{ url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3003' }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
            schemas: {
                OrderBody: {
                    type: 'object', required: ['productId', 'userId', 'quantity'],
                    properties: {
                        productId: { type: 'string', minLength: 24, maxLength: 24, example: '6751abc123def456789012' },
                        userId: { type: 'string', minLength: 24, maxLength: 24, example: '6751abc123def456789013' },
                        quantity: { type: 'integer', minimum: 1, example: 2 },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '6751abc123def456789014' },
                        productId: { type: 'string', example: '6751abc123def456789012' },
                        userId: { type: 'string', example: '6751abc123def456789013' },
                        quantity: { type: 'integer', example: 2 },
                        status: { type: 'string', enum: ['Pending', 'Completed', 'Cancelled'], example: 'Pending' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                OrderList: {
                    type: 'object',
                    properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                        total: { type: 'integer', example: 10 },
                        limit: { type: 'integer', example: 20 },
                        offset: { type: 'integer', example: 0 },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/orderRoutes.js'],
});
