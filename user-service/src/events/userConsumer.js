const kafka = require('kafka-node');
const logger = require('../logger');

const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'kafka:29092' });
client.on('error', (err) => logger.error({ err }, 'Kafka client error'));

const consumer = new kafka.Consumer(client, [{ topic: 'user-events' }], { autoCommit: true });

consumer.on('message', (message) => {
  const event = JSON.parse(message.value);
  if (event.type === 'UserRegistered') {
    logger.info({ user: event.data }, 'Handling UserRegistered event');
  }
});

consumer.on('error', (err) => logger.error({ err }, 'Error in Kafka consumer'));
