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

const produceOrderEvent = async (order) => {
  try {
    const p = await getProducer();

    await p.send({
      topic: 'order-events',
      messages: [{ value: JSON.stringify(order) }],
    });

    logger.info({ orderId: order._id }, 'Order event produced');
  } catch (err) {
    logger.error({ err }, 'Failed to produce order event');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (producer) {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  }
});

module.exports = { produceOrderEvent };
