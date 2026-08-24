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

// Emit 'Product Created' event
exports.emitProductCreatedEvent = (product) => {
  try {
    const p = getProducer();
    const event = { type: 'ProductCreated', data: product };
    const payloads = [{ topic: 'product-events', messages: JSON.stringify(event) }];
    p.send(payloads, (err, data) => {
      if (err) console.error('Failed to emit ProductCreated event:', err);
      else console.log('ProductCreated event emitted:', data);
    });
  } catch (err) {
    console.error('Kafka not available, skipping event:', err.message);
  }
};
