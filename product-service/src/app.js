const express = require('express');
const mongoose = require('mongoose');
const pinoHttp = require('pino-http');
const productRoutes = require('./routes/productRoutes');
const logger = require('./logger');
require('dotenv').config();

const app = express();
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

// Health check — public, no auth
app.get('/health', (req, res) => {
    const db = mongoose.connection.readyState === 1;
    const status = db ? 200 : 503;
    res.status(status).json({ status: db ? 'ok' : 'degraded', service: 'product-service', timestamp: new Date().toISOString() });
});

app.use('/products', productRoutes);
require('./events/productConsumer');

app.use((req, res) => res.status(404).json({ error: 'Route not found', status: 404 }));
app.use(require('./middleware/errorHandler'));

const port = process.env.PORT || 3002;
const server = app.listen(port, () => {
    logger.info(`Product service running on port ${port}`);
});

process.on('SIGINT', async () => {
    logger.info('Received SIGINT. Closing the server...');
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = server;
