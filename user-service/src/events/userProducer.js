const createKafkaClient = require('./kafkaConfig');
const logger = require('../logger');

let producer = null;

const getProducer = async () => {
  if (!producer) {
    const kafka = createKafkaClient();
    producer = kafka.producer();

    await producer.connect();
    logger.info('Kafka producer connected');

    producer.on('producer.disconnect', () => {
      logger.warn('Kafka producer disconnected');
    });
  }
  return producer;
};

exports.emitUserRegisteredEvent = async (user) => {
  try {
    const p = await getProducer();
    const event = { type: 'UserRegistered', data: user };

    await p.send({
      topic: 'user-events',
      messages: [{ value: JSON.stringify(event) }],
    });

    logger.info({ userId: user.id }, 'UserRegistered event emitted');
  } catch (err) {
    logger.error({ err }, 'Failed to emit UserRegistered event');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (producer) {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  }
});
