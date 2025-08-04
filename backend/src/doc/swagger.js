const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API docs',
            version: '1.0.0',
            description: 'API docs',
        },
        servers: [
            {
                url: 'http://localhost:8001',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'Bearer',
                    bearerFormat: 'JWT',
                    description: 'Access token',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                    description: 'Refresh token',
                },
            },
        },
    },
    apis: ['./src/doc/*.yaml'],
};



const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
