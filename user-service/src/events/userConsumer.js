const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const consumer = new kafka.Consumer(client, [{ topic: 'user-events' }], { autoCommit: true });

// Listen for user-related events
consumer.on('message', (message) => {
  const event = JSON.parse(message.value);
  if (event.type === 'UserRegistered') {
    console.log('Handling UserRegistered event:', event.data);
    // Implement any logic needed for this event
  }
});

consumer.on('error', (err) => {
  console.error('Error in Kafka consumer:', err);
});
