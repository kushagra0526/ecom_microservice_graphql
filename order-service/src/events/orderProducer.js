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

const produceOrderEvent = (order) => {
  try {
    const p = getProducer();
    const payloads = [{ topic: 'order-events', messages: JSON.stringify(order) }];
    p.send(payloads, (error, result) => {
      if (error) logger.error({ error }, 'Failed to produce order event');
      else logger.info({ result }, 'Order event produced');
    });
  } catch (err) {
    logger.error({ err }, 'Kafka not available, skipping event');
  }
};

module.exports = { produceOrderEvent };
