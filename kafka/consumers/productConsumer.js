const kafka = require('kafka-node');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new Consumer(
  client,
  [{ topic: 'product-events', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  console.log('Received product event:', message.value);
  // Process the product event here (e.g., save to DB)
});

consumer.on('error', (err) => {
  console.error('Error in product consumer:', err);
});
