const kafka = require('kafka-node');
const logger = require('../logger');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'kafka:29092' });
kafkaClient.on('error', (err) => logger.error({ err }, 'Kafka client error'));

const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: 'order-events', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  logger.info({ value: message.value }, 'Order event received');
});

consumer.on('error', (err) => logger.error({ err }, 'Error in Kafka consumer'));
