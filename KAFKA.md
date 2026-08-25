# Kafka Integration Guide

## Overview

This project uses **Apache Kafka** for event-driven communication between microservices. The implementation supports both:

- **Local Docker Kafka** (for development)
- **Upstash Kafka** (for cloud deployment)

## Architecture

```
User Service ──┐
               │
Product Service├──► Kafka Broker ──► Consumers
               │
Order Service ─┘
```

### Events Published

| Service | Topic | Event Type | Description |
| --------- | ------- | ------------ | ------------- |
| User Service | `user-events` | `UserRegistered` | Emitted when a new user registers |
| Product Service | `product-events` | `ProductCreated` | Emitted when a new product is created |
| Order Service | `order-events` | Order data | Emitted when a new order is placed |

## Technology Stack

- **Library**: [KafkaJS](https://kafka.js.org/) v2.2.4
- **Why KafkaJS?**
  - ✅ Native async/await support
  - ✅ SASL authentication support (required for Upstash)
  - ✅ Better error handling and retry mechanisms
  - ✅ Active maintenance and modern API
  - ✅ Works with both local Kafka and cloud providers

## Configuration

### Local Development (Docker Kafka)

Set these environment variables in each service:

```env
KAFKA_BROKER=kafka:29092
# No authentication needed - uses PLAINTEXT
```

### Production (Upstash Kafka)

Set these environment variables in each service:

```env
KAFKA_BROKER=your-upstash-endpoint.upstash.io:9092
KAFKA_USERNAME=your-upstash-username
KAFKA_PASSWORD=your-upstash-password
KAFKA_SASL_MECHANISM=scram-sha-256
```

The `kafkaConfig.js` automatically detects which mode to use based on whether credentials are provided.

## Code Structure

### Kafka Configuration (`kafkaConfig.js`)

```javascript
const { Kafka } = require('kafkajs');

const createKafkaClient = () => {
  const brokers = (process.env.KAFKA_BROKER || 'localhost:9092').split(',');
  
  const config = {
    clientId: 'service-name',
    brokers,
    retry: {
      retries: 5,
      initialRetryTime: 300,
      maxRetryTime: 30000,
    },
  };

  // Auto-detect: Add SASL if credentials provided
  if (process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
    config.sasl = {
      mechanism: 'scram-sha-256',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
    };
    config.ssl = true;
  }

  return new Kafka(config);
};
```

### Producer Pattern

```javascript
const createKafkaClient = require('./kafkaConfig');
let producer = null;

const getProducer = async () => {
  if (!producer) {
    const kafka = createKafkaClient();
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
};

exports.emitEvent = async (data) => {
  try {
    const p = await getProducer();
    await p.send({
      topic: 'event-topic',
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (err) {
    console.error('Failed to emit event:', err);
  }
};
```

### Consumer Pattern

```javascript
const createKafkaClient = require('./kafkaConfig');
const kafka = createKafkaClient();
const consumer = kafka.consumer({ groupId: 'service-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'event-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      // Process event
    },
  });
};

runConsumer();
```

## Event Flow Example

### 1. User Registration Flow

```javascript
// User Service Controller
const newUser = await User.create({ username, email, password });

// Emit event (non-blocking)
emitUserRegisteredEvent({ 
  id: newUser._id, 
  username, 
  email 
}).catch(err => console.error('Event emission failed:', err));

// Return response immediately
res.status(201).json({ userId: newUser._id });
```

### 2. Consumer Processing

```javascript
// User Service Consumer
consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value.toString());
    
    if (event.type === 'UserRegistered') {
      // Send welcome email
      // Update analytics
      // Trigger other workflows
    }
  }
});
```

## Testing Kafka Locally

### 1. Check if Kafka is running

```bash
docker ps | grep kafka
```

### 2. List topics

```bash
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
```

Expected output:

```
user-events
product-events
order-events
```

### 3. Produce a test message

```bash
docker exec -it kafka kafka-console-producer \
  --topic user-events \
  --bootstrap-server localhost:9092
```

### 4. Consume messages

```bash
docker exec -it kafka kafka-console-consumer \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --from-beginning
```

### 5. Check service logs

```bash
# Check producer
docker logs user-service | grep "event emitted"

# Check consumer
docker logs user-service | grep "Received.*event"
```

## Deploying to Render with Upstash

### Step 1: Create Upstash Kafka Cluster

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Kafka cluster
3. Note your credentials:
   - Endpoint: `xxx.upstash.io:9092`
   - Username: `xxxxx`
   - Password: `xxxxx`

### Step 2: Create Topics

In Upstash console, create these topics:

- `user-events`
- `product-events`
- `order-events`

### Step 3: Configure Render Environment Variables

For each service on Render, add:

```env
KAFKA_BROKER=your-endpoint.upstash.io:9092
KAFKA_USERNAME=your-username
KAFKA_PASSWORD=your-password
KAFKA_SASL_MECHANISM=scram-sha-256
```

### Step 4: Deploy

```bash
git push origin main
```

Render will automatically detect the changes and redeploy with Kafka support!

## Interview Talking Points

### Why Kafka?

1. **Decoupling**: Services don't need to know about each other
2. **Asynchronous**: Non-blocking event processing
3. **Scalability**: Can handle millions of events per second
4. **Reliability**: Event persistence and replay capabilities
5. **Real-time**: Low latency event streaming

### Event-Driven Architecture Benefits

- **Loose Coupling**: Services communicate through events, not direct API calls
- **Resilience**: If a consumer is down, events are stored and processed later
- **Scalability**: Easy to add new consumers without modifying producers
- **Audit Trail**: All events are logged and can be replayed

### KafkaJS vs kafka-node

| Feature | kafka-node | KafkaJS |
| --------- | ----------- | --------- |
| Async/Await | ❌ Callback-based | ✅ Native async/await |
| SASL Auth | ❌ No support | ✅ Full support |
| Maintenance | ❌ Deprecated | ✅ Active development |
| Cloud Ready | ❌ No | ✅ Yes (Upstash, Confluent) |
| Error Handling | ⚠️ Basic | ✅ Advanced with retries |

### Consumer Groups

Each service has its own consumer group:

- `user-service-group`
- `product-service-group`
- `order-service-group`

**Benefits:**

- Parallel processing across multiple instances
- Automatic partition assignment
- Fault tolerance with rebalancing

## Troubleshooting

### Consumer not receiving messages

```bash
# Check if consumer is connected
docker logs user-service | grep "Consumer has joined"

# Verify topics exist
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092

# Check consumer group lag
docker exec kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --group user-service-group \
  --describe
```

### Connection refused errors

```bash
# Restart services (Kafka takes time to start)
docker restart user-service product-service order-service

# Check Kafka is ready
docker logs kafka | grep "started (kafka.server.KafkaServer)"
```

### Events not being produced

```bash
# Check producer connection
docker logs user-service | grep "producer connected"

# Test with curl
curl -X POST http://localhost:3001/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass123"}'

# Check logs immediately
docker logs user-service --tail 10
```

## Performance Considerations

### Producer Configuration

- **Batching**: KafkaJS automatically batches messages for better throughput
- **Compression**: Can enable gzip/snappy compression for large messages
- **Idempotence**: Ensures exactly-once semantics

### Consumer Configuration

- **Partition Assignment**: Consumers automatically distribute across partitions
- **Offset Management**: Auto-commit enabled for simplicity
- **fromBeginning: false**: Only consume new messages (configurable)

## Security Best Practices

1. **Never commit credentials**: Use environment variables
2. **Use SASL/SSL**: Always use authentication in production
3. **Principle of least privilege**: Each service only accesses its own topics
4. **Encrypt in transit**: SSL/TLS enabled for Upstash

## Monitoring

### Key Metrics to Monitor

1. **Producer Metrics**
   - Message send rate
   - Failed sends
   - Producer lag

2. **Consumer Metrics**
   - Consumer lag (messages behind)
   - Processing rate
   - Error rate

3. **Broker Metrics**
   - Disk usage
   - Network throughput
   - Active connections

### Logging

All Kafka operations are logged using Pino structured logging:

```javascript
logger.info({ userId }, 'UserRegistered event emitted');
logger.error({ err }, 'Failed to emit event');
```

## Future Enhancements

- [ ] Add event schemas with Avro/JSON Schema
- [ ] Implement dead letter queue for failed events
- [ ] Add monitoring with Prometheus/Grafana
- [ ] Implement saga pattern for distributed transactions
- [ ] Add event versioning strategy
- [ ] Implement event replay capability

---

**Built with ❤️ for event-driven microservices**
