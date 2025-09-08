const kafka = require('kafka-node');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new Consumer(
  client,
  [{ topic: 'order-events', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  console.log('Received order event:', message.value);
  // Process the order event here (e.g., save to DB)
});

consumer.on('error', (err) => {
  console.error('Error in order consumer:', err);
});
