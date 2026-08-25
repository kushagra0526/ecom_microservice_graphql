const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock axios BEFORE requiring the app so the cross-service validation calls don't hit real services
jest.mock('axios');
const axios = require('axios');

const server = require('../src/app');

const token = jwt.sign({ userId: 'testuser' }, process.env.JWT_SECRET || 'fallback_secret');

const PRODUCT_ID = '60c72b2f4f1a2a001c8f0c9e';
const USER_ID = '60c72b2f4f1a2a001c8f0c9f';

describe('Order Service', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    await mongoose.model('Order').deleteMany({});
    // Make both upstream validation calls succeed by default
    axios.get.mockResolvedValue({ data: {} });
  });

  it('should create a new order', async () => {
    const response = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: PRODUCT_ID, userId: USER_ID, quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('productId', PRODUCT_ID);
  });

  it('should get all orders', async () => {
    const response = await request(server)
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    // Response is paginated: { data, total, limit, offset }
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get an order by ID', async () => {
    const newOrder = await mongoose.model('Order').create({
      productId: PRODUCT_ID,
      userId: USER_ID,
      quantity: 2,
    });

    const response = await request(server)
      .get(`/orders/${newOrder._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productId', PRODUCT_ID);
  });
});
