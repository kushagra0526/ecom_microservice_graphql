const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'user-group' });

const run = async () => {
  try {
    // Connecting to the broker
    await consumer.connect();
    console.log('Connected to Kafka');

    // Subscribing to the topic
    await consumer.subscribe({ topic: 'user-events', fromBeginning: true });
    console.log('Subscribed to user-events topic');

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
          topic: topic,
          partition: partition,
        });
      },
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

run().catch(console.error);

// Graceful shutdown
const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});