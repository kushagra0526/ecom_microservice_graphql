const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock Kafka consumer to prevent it from starting during tests
jest.mock('../src/events/productConsumer', () => ({}));

const server = require('../src/app');

// Generate a valid token for protected routes
const token = jwt.sign({ userId: 'testuser' }, process.env.JWT_SECRET || 'fallback_secret');

describe('Product Service', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    await mongoose.model('Product').deleteMany({});
  });

  it('should create a new product', async () => {
    const response = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
      });
    expect(response.status).toBe(201);
    expect(response.body.product).toHaveProperty('name', 'Test Product');
  });

  it('should get all products', async () => {
    const response = await request(server)
      .get('/products')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    // Response is paginated: { data, total, limit, offset }
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get a product by ID', async () => {
    const product = await mongoose.model('Product').create({
      name: 'Another Product',
      description: 'This is another product',
      price: 49.99,
    });

    const response = await request(server)
      .get(`/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Another Product');
  });
});
