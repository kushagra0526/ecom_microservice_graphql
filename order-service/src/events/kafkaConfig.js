const { Kafka } = require('kafkajs');
const logger = require('../logger');

// Kafka configuration that supports both Docker (PLAINTEXT) and Upstash (SASL)
const createKafkaClient = () => {
    const brokers = (process.env.KAFKA_BROKER || 'localhost:9092').split(',');

    const config = {
        clientId: 'order-service',
        brokers,
        retry: {
            retries: 5,
            initialRetryTime: 300,
            maxRetryTime: 30000,
        },
    };

    // Add SASL authentication if credentials are provided (for Upstash)
    if (process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
        config.sasl = {
            mechanism: process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256',
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
        };
        config.ssl = true;
        logger.info('Kafka configured with SASL authentication');
    } else {
        logger.info('Kafka configured with PLAINTEXT (no authentication)');
    }

    return new Kafka(config);
};

module.exports = createKafkaClient;
