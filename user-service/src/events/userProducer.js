const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new kafka.Producer(client);

// Emit 'User Registered' event
exports.emitUserRegisteredEvent = (user) => {
  const event = { type: 'UserRegistered', data: user };
  const payloads = [{ topic: 'user-events', messages: JSON.stringify(event) }];
  producer.send(payloads, (err, data) => {
    if (err) console.error('Failed to emit UserRegistered event:', err);
    else console.log('UserRegistered event emitted:', data);
  });
};
