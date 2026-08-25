const kafka = require('kafka-node');
const logger = require('../logger');

let producer = null;

const getProducer = () => {
  if (!producer) {
    const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'kafka:29092' });
    producer = new kafka.Producer(client);
    client.on('error', (err) => logger.error({ err }, 'Kafka client error'));
    producer.on('error', (err) => logger.error({ err }, 'Kafka producer error'));
  }
  return producer;
};

exports.emitProductCreatedEvent = (product) => {
  try {
    const p = getProducer();
    const event = { type: 'ProductCreated', data: product };
    const payloads = [{ topic: 'product-events', messages: JSON.stringify(event) }];
    p.send(payloads, (err, data) => {
      if (err) logger.error({ err }, 'Failed to emit ProductCreated event');
      else logger.info({ data }, 'ProductCreated event emitted');
    });
  } catch (err) {
    logger.error({ err }, 'Kafka not available, skipping event');
  }
};
