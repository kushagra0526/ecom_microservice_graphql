const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'User Service API', version: '1.0.0', description: 'User management microservice' },
        servers: [{ url: 'http://localhost:3001' }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
            schemas: {
                RegisterBody: {
                    type: 'object', required: ['username', 'email', 'password'],
                    properties: {
                        username: { type: 'string', minLength: 2, maxLength: 50, example: 'kushagra' },
                        email: { type: 'string', format: 'email', example: 'kush@gmail.com' },
                        password: { type: 'string', minLength: 6, example: 'secret123' },
                    },
                },
                LoginBody: {
                    type: 'object', required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'kush@gmail.com' },
                        password: { type: 'string', example: 'secret123' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '6751abc123def456789012' },
                        username: { type: 'string', example: 'kushagra' },
                        email: { type: 'string', example: 'kush@gmail.com' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        status: { type: 'integer' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/userRoutes.js'],
});
