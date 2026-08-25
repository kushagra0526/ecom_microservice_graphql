const createKafkaClient = require('./kafkaConfig');
const logger = require('../logger');

let consumer = null;

const runConsumer = async () => {
  try {
    const kafka = createKafkaClient();
    consumer = kafka.consumer({ groupId: 'user-service-group' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'user-events', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          logger.info({ event }, 'Received user event');

          switch (event.type) {
            case 'UserRegistered':
              logger.info({ user: event.data }, 'Handling UserRegistered event');
              // Additional logic here (e.g., send welcome email, update analytics)
              break;
            default:
              logger.warn({ type: event.type }, 'Unknown event type');
          }
        } catch (err) {
          logger.error({ err }, 'Error processing user event');
        }
      },
    });

    logger.info('User service Kafka consumer started');
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
