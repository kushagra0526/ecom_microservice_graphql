const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
  }

  type Order {
    id: ID!
    productId: ID!
    userId: ID!
    quantity: Int!
    status: String!
  }

  type ProductList {
    data: [Product]
    total: Int!
    limit: Int!
    offset: Int!
  }

  type OrderList {
    data: [Order]
    total: Int!
    limit: Int!
    offset: Int!
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
    getProducts(limit: Int, offset: Int): ProductList
    getProduct(id: ID!): Product
    getOrders(limit: Int, offset: Int): OrderList
    getOrder(id: ID!): Order
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    createProduct(name: String!, description: String!, price: Float!): Product
    updateProduct(id: ID!, name: String, description: String, price: Float): Product
    deleteProduct(id: ID!): String
    createOrder(productId: ID!, userId: ID!, quantity: Int!): Order
  }
`;

module.exports = typeDefs;
