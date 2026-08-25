const pino = require('pino');
module.exports = pino({ name: 'order-service', level: process.env.LOG_LEVEL || 'info' });
