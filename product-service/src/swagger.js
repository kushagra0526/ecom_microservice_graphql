const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Product Service API', version: '1.0.0', description: 'Product management microservice' },
        servers: [{ url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3002' }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
            schemas: {
                ProductBody: {
                    type: 'object', required: ['name', 'description', 'price'],
                    properties: {
                        name: { type: 'string', example: 'iPhone 15' },
                        description: { type: 'string', example: 'Apple smartphone' },
                        price: { type: 'number', minimum: 0.01, example: 999.99 },
                    },
                },
                ProductUpdateBody: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'iPhone 15 Pro' },
                        description: { type: 'string', example: 'Updated description' },
                        price: { type: 'number', minimum: 0.01, example: 1099.99 },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '6751abc123def456789012' },
                        name: { type: 'string', example: 'iPhone 15' },
                        description: { type: 'string', example: 'Apple smartphone' },
                        price: { type: 'number', example: 999.99 },
                        createdBy: { type: 'string', example: '6751abc123def456789010' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                ProductList: {
                    type: 'object',
                    properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                        total: { type: 'integer', example: 42 },
                        limit: { type: 'integer', example: 20 },
                        offset: { type: 'integer', example: 0 },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/productRoutes.js'],
});
