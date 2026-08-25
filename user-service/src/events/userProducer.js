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

exports.emitUserRegisteredEvent = (user) => {
  try {
    const p = getProducer();
    const event = { type: 'UserRegistered', data: user };
    const payloads = [{ topic: 'user-events', messages: JSON.stringify(event) }];
    p.send(payloads, (err, data) => {
      if (err) logger.error({ err }, 'Failed to emit UserRegistered event');
      else logger.info({ data }, 'UserRegistered event emitted');
    });
  } catch (err) {
    logger.error({ err }, 'Kafka not available, skipping event');
  }
};
