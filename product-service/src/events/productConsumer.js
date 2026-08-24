const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'kafka:29092' });
client.on('error', (err) => console.error('Kafka client error:', err));

const consumer = new kafka.Consumer(
  client,
  [{ topic: 'product-events' }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  const event = JSON.parse(message.value);
  if (event.type === 'ProductCreated') {
    console.log('Handling ProductCreated event:', event.data);
  }
});

consumer.on('error', (err) => {
  console.error('Error in Kafka consumer:', err);
});
