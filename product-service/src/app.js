const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const productRoutes = require('./routes/productRoutes');
const logger = require('./logger');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(pinoHttp({
    logger,
    redact: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
}));

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    logger.error('MONGO_URI is not defined. Please check your .env file.');
    process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error({ err }, 'Error connecting to MongoDB'));

// API docs — public, no rate limit (registered before limiter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger')));

// Health check — exempt from rate limiting (registered before limiter)
app.get('/health', (req, res) => {
    const db = mongoose.connection.readyState === 1;
    const status = db ? 200 : 503;
    res.status(status).json({ status: db ? 'ok' : 'degraded', service: 'product-service', timestamp: new Date().toISOString() });
});

// Global limiter — 100 req / 15 min per IP
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.', status: 429 },
}));

app.use('/products', productRoutes);
require('./events/productConsumer');

app.use((req, res) => res.status(404).json({ error: 'Route not found', status: 404 }));
app.use(require('./middleware/errorHandler'));

const port = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT || 3002);
const server = app.listen(port, () => {
    logger.info(`Product service running on port ${port}`);
});

process.on('SIGINT', async () => {
    logger.info('Received SIGINT. Closing the server...');
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = server;
