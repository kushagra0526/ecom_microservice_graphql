const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new kafka.Producer(client);

// Emit 'Product Created' event
exports.emitProductCreatedEvent = (product) => {
  const event = { type: 'ProductCreated', data: product };
  const payloads = [{ topic: 'product-events', messages: JSON.stringify(event) }];
  producer.send(payloads, (err, data) => {
    if (err) console.error('Failed to emit ProductCreated event:', err);
    else console.log('ProductCreated event emitted:', data);
  });
};
