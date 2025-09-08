const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: 'order_created', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  console.log('Order event received:', message.value);
  // Handle the order event here (e.g., update databases, send notifications, etc.)
});

consumer.on('error', (err) => {
  console.error('Error in Kafka consumer:', err);
});
