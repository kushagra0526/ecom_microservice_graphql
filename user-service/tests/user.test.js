const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const server = require('../src/app');
const User = require('../src/models/userModel');

describe('User Service', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const response = await request(server).post('/users/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
  });

  it('should not register user with existing email', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    const response = await request(server).post('/users/register').send({
      username: 'newuser',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(409);
  });

  it('should login a user and return a JWT token', async () => {
    await User.create({
      username: 'authuser',
      email: 'auth@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    const response = await request(server).post('/users/login').send({
      email: 'auth@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
