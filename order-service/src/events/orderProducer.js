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

const produceOrderEvent = (order) => {
  try {
    const p = getProducer();
    const payloads = [{ topic: 'order-events', messages: JSON.stringify(order) }];
    p.send(payloads, (error, result) => {
      if (error) console.error('Failed to produce order event:', error);
      else console.log('Order event produced:', result);
    });
  } catch (err) {
    console.error('Kafka not available, skipping event:', err.message);
  }
};

module.exports = { produceOrderEvent };
