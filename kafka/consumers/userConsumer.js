const kafka = require('kafka-node');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'localhost:9092' });

const consumer = new Consumer(
  client,
  [{ topic: 'user-events', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  console.log('Received user event:', message.value);
  // Process the user event here
});

consumer.on('error', (err) => {
  console.error('Error in user consumer:', err);
});
