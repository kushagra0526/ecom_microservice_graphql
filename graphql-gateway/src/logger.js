const pino = require('pino');
module.exports = pino({ name: 'graphql-gateway', level: process.env.LOG_LEVEL || 'info' });
