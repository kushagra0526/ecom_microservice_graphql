const express = require('express');
const mongoose = require('mongoose');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const logger = require('./logger');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(pinoHttp({
  logger,
  redact: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
}));

const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => {
    logger.error({ err }, 'Could not connect to MongoDB');
    process.exit(1);
  });

// Health check — exempt from rate limiting (registered before limiters)
app.get('/health', (req, res) => {
  const db = mongoose.connection.readyState === 1;
  const status = db ? 200 : 503;
  res.status(status).json({ status: db ? 'ok' : 'degraded', service: 'user-service', timestamp: new Date().toISOString() });
});

// Global limiter — 100 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', status: 429 },
}));

app.use('/users', userRoutes);
require('./events/userConsumer');

app.use((req, res) => res.status(404).json({ error: 'Route not found', status: 404 }));
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Closing the server...');
  await mongoose.connection.close();
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

module.exports = server;
