const pino = require('pino');
module.exports = pino({ name: 'user-service', level: process.env.LOG_LEVEL || 'info' });
