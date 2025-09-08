const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../src/app'); // Import the server instance

describe('Product Service', () => {
  // Connect to MongoDB before running tests
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Close MongoDB connection and server after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    // Close the server
    server.close();
  });

  it('should create a new product', async () => {
    const response = await request(server).post('/products').send({
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
    });
    expect(response.status).toBe(201);
    expect(response.body.product).toHaveProperty('name', 'Test Product');
  });

  it('should get all products', async () => {
    const response = await request(server).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ensure it returns an array
  });

  it('should get a product by ID', async () => {
    const product = await mongoose.model('Product').create({
      name: 'Another Product',
      description: 'This is another product',
      price: 49.99,
    });

    const response = await request(server).get(`/products/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Another Product');
  });
});
