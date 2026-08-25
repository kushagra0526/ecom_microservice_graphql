// Mock axios before requiring resolvers — resolvers make real HTTP calls
jest.mock('axios');
const axios = require('axios');

const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../src/schemas');
const resolvers = require('../src/resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

describe('GraphQL API Gateway', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch users', async () => {
    // Mock upstream user-service response
    axios.get.mockResolvedValue({
      data: [{ _id: '6751abc123def456789012', username: 'kushagra', email: 'kush@gmail.com' }],
    });

    const { query } = createTestClient(server);
    const res = await query({
      query: `query { getUsers { id username email } }`,
    });

    expect(res.errors).toBeUndefined();
    expect(Array.isArray(res.data.getUsers)).toBe(true);
    expect(res.data.getUsers[0]).toHaveProperty('username', 'kushagra');
  });

  it('should create a new user', async () => {
    // Mock upstream user-service register response
    axios.post.mockResolvedValue({
      data: { userId: '6751abc123def456789012', message: 'User registered successfully' },
    });

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: `
        mutation {
          createUser(username: "kushagra", email: "kush@gmail.com", password: "secret123") {
            id
            username
            email
          }
        }
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createUser).toHaveProperty('id');
    expect(res.data.createUser).toHaveProperty('username', 'kushagra');
  });

  it('should fetch products (paginated)', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: [{ _id: '6751abc123def456789013', name: 'iPhone 15', description: 'Phone', price: 999.99 }],
        total: 1,
        limit: 20,
        offset: 0,
      },
    });

    const { query } = createTestClient(server);
    const res = await query({
      query: `query { getProducts { data { id name price } total limit offset } }`,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.getProducts).toHaveProperty('total', 1);
    expect(Array.isArray(res.data.getProducts.data)).toBe(true);
  });

  it('should create a new product', async () => {
    axios.post.mockResolvedValue({
      data: {
        message: 'Product created successfully',
        product: { _id: '6751abc123def456789013', name: 'iPhone 15', description: 'Phone', price: 999.99 },
      },
    });

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: `
        mutation {
          createProduct(name: "iPhone 15", description: "Phone", price: 999.99) {
            id
            name
            price
          }
        }
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createProduct).toHaveProperty('name', 'iPhone 15');
  });
});
