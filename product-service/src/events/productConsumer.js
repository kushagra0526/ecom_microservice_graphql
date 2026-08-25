const createKafkaClient = require('./kafkaConfig');
const logger = require('../logger');

const kafka = createKafkaClient();
const consumer = kafka.consumer({ groupId: 'product-service-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'product-events', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          logger.info({ event }, 'Received product event');

          switch (event.type) {
            case 'ProductCreated':
              logger.info({ product: event.data }, 'Handling ProductCreated event');
              // Additional logic here (e.g., update search index, notify subscribers)
              break;
            default:
              logger.warn({ type: event.type }, 'Unknown event type');
          }
        } catch (err) {
          logger.error({ err }, 'Error processing product event');
        }
      },
    });

    logger.info('Product service Kafka consumer started');
  } catch (err) {
    logger.error({ err }, 'Error in Kafka consumer');
  }
};

// Start consumer
runConsumer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await consumer.disconnect();
  logger.info('Kafka consumer disconnected');
});
