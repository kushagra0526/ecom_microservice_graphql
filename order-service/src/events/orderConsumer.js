const createKafkaClient = require('./kafkaConfig');
const logger = require('../logger');

const kafka = createKafkaClient();
const consumer = kafka.consumer({ groupId: 'order-service-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order-events', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const order = JSON.parse(message.value.toString());
          logger.info({ order }, 'Order event received');

          // Additional logic here (e.g., update inventory, notify warehouse)
        } catch (err) {
          logger.error({ err }, 'Error processing order event');
        }
      },
    });

    logger.info('Order service Kafka consumer started');
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
