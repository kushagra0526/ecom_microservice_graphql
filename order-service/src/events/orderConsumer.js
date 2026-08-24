const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'kafka:29092' });
kafkaClient.on('error', (err) => console.error('Kafka client error:', err));

const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: 'order-events', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  console.log('Order event received:', message.value);
});

consumer.on('error', (err) => {
  console.error('Error in Kafka consumer:', err);
});
