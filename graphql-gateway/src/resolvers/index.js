const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

const resolvers = {
  Query: {
    getUsers: async () => {
      const response = await axios.get(`${USER_SERVICE_URL}/users`);
      return response.data;
    },
    getUser: async (_, { id }) => {
      const response = await axios.get(`${USER_SERVICE_URL}/users/${id}`);
      return response.data;
    },
    getProducts: async () => {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
      return response.data;
    },
    getProduct: async (_, { id }) => {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${id}`);
      return response.data;
    },
    getOrders: async () => {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders`);
      return response.data;
    },
    getOrder: async (_, { id }) => {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${id}`);
      return response.data;
    },
  },
  Mutation: {
    // createUser maps to the user-service register endpoint
    createUser: async (_, { username, email, password }) => {
      const response = await axios.post(`${USER_SERVICE_URL}/users/register`, { username, email, password });
      // user-service returns { message, userId } — map it to GraphQL User type
      return {
        id: response.data.userId,
        username,
        email,
      };
    },
    createProduct: async (_, { name, description, price }) => {
      const response = await axios.post(`${PRODUCT_SERVICE_URL}/products`, { name, description, price });
      // product-service returns { message, product } — map it to GraphQL Product type
      const p = response.data.product;
      return {
        id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
      };
    },
    createOrder: async (_, { productId, userId, quantity }) => {
      const response = await axios.post(`${ORDER_SERVICE_URL}/orders`, { productId, userId, quantity });
      // order-service returns the order object directly
      const o = response.data;
      return {
        id: o._id,
        productId: o.productId,
        userId: o.userId,
        quantity: o.quantity,
        status: o.status,
      };
    },
  },
};

module.exports = resolvers;
