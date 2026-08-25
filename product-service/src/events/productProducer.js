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

exports.emitProductCreatedEvent = async (product) => {
  try {
    const p = await getProducer();
    const event = { type: 'ProductCreated', data: product };

    await p.send({
      topic: 'product-events',
      messages: [{ value: JSON.stringify(event) }],
    });

    logger.info({ productId: product.id }, 'ProductCreated event emitted');
  } catch (err) {
    logger.error({ err }, 'Failed to emit ProductCreated event');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (producer) {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  }
});
