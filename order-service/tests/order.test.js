const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../src/app');

describe('Order Service', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should create a new order', async () => {
    const response = await request(server).post('/orders').send({
      productId: '60c72b2f4f1a2a001c8f0c9e',
      userId: '60c72b2f4f1a2a001c8f0c9f',
      quantity: 2,
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('productId', '60c72b2f4f1a2a001c8f0c9e');
  });

  it('should get all orders', async () => {
    const response = await request(server).get('/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get an order by ID', async () => {
    const newOrder = await mongoose.model('Order').create({
      productId: '60c72b2f4f1a2a001c8f0c9e',
      userId: '60c72b2f4f1a2a001c8f0c9f',
      quantity: 2,
    });

    const response = await request(server).get(`/orders/${newOrder._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productId', '60c72b2f4f1a2a001c8f0c9e');
  });
});
