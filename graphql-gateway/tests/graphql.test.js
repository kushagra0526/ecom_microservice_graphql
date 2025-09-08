const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../src/schemas');
const resolvers = require('../src/resolvers');

// Set up a test instance of Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

describe('GraphQL API Gateway', () => {
  it('should fetch users', async () => {
    const { query } = createTestClient(server);
    const GET_USERS = `
      query {
        getUsers {
          id
          name
          email
        }
      }
    `;
    const res = await query({ query: GET_USERS });
    expect(res.data.getUsers).toBeDefined();
    expect(Array.isArray(res.data.getUsers)).toBe(true);
  });

  it('should create a new user', async () => {
    const { mutate } = createTestClient(server);
    const CREATE_USER = `
      mutation {
        createUser(name: "John Doe", email: "john@example.com") {
          id
          name
          email
        }
      }
    `;
    const res = await mutate({ mutation: CREATE_USER });
    expect(res.data.createUser).toHaveProperty('id');
    expect(res.data.createUser).toHaveProperty('name', 'John Doe');
  });
});
