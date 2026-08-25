const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const logger = require('./logger');
require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Forward the Authorization header to downstream services
    const authorization = req.headers.authorization || '';
    return { authorization };
  },
});

const port = process.env.PORT || 4000;

server.listen({ port }).then(({ url }) => {
  logger.info(`GraphQL API Gateway ready at ${url}`);
});
