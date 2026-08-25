const pino = require('pino');
module.exports = pino({ name: 'product-service', level: process.env.LOG_LEVEL || 'info' });
