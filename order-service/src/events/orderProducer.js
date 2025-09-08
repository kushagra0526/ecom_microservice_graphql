const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new kafka.Producer(kafkaClient);

const produceOrderEvent = (order) => {
  const payloads = [
    { topic: 'order_created', messages: JSON.stringify(order) },
  ];
  
  producer.send(payloads, (error, result) => {
    if (error) {
      console.error('Failed to produce order event:', error);
    } else {
      console.log('Order event produced:', result);
    }
  });
};

module.exports = { produceOrderEvent };
