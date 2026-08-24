const kafka = require('kafka-node');

let producer = null;

const getProducer = () => {
  if (!producer) {
    const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'kafka:29092' });
    producer = new kafka.Producer(client);
    client.on('error', (err) => console.error('Kafka client error:', err));
    producer.on('error', (err) => console.error('Kafka producer error:', err));
  }
  return producer;
};

// Emit 'User Registered' event
exports.emitUserRegisteredEvent = (user) => {
  try {
    const p = getProducer();
    const event = { type: 'UserRegistered', data: user };
    const payloads = [{ topic: 'user-events', messages: JSON.stringify(event) }];
    p.send(payloads, (err, data) => {
      if (err) console.error('Failed to emit UserRegistered event:', err);
      else console.log('UserRegistered event emitted:', data);
    });
  } catch (err) {
    console.error('Kafka not available, skipping event:', err.message);
  }
};
