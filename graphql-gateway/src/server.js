const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const logger = require('./logger');
require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // You can add user authentication logic here if needed
  },
});

const port = process.env.PORT || 4000;

server.listen({ port }).then(({ url }) => {
  logger.info(`GraphQL API Gateway ready at ${url}`);
});
