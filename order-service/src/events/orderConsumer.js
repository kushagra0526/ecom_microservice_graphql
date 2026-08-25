const createKafkaClient = require('./kafkaConfig');
const logger = require('../logger');

let consumer = null;

const runConsumer = async () => {
  try {
    const kafka = createKafkaClient();
    consumer = kafka.consumer({ groupId: 'order-service-group' });

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

// Only start the consumer when not in test environment
if (process.env.NODE_ENV !== 'test') {
  runConsumer();
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (consumer) {
    await consumer.disconnect();
    logger.info('Kafka consumer disconnected');
  }
});
