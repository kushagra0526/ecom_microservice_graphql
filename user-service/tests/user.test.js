const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/userModel');

describe('User Service', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/users/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('username', 'testuser');
  });

  it('should not register user with existing username', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/users/register').send({
      username: 'testuser',
      email: 'new@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(500);
  });

  it('should authenticate a user and return a JWT', async () => {
    await User.create({
      username: 'authuser',
      email: 'auth@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    const response = await request(app).post('/users/login').send({
      username: 'authuser',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
