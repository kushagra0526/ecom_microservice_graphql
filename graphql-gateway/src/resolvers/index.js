const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

// MongoDB returns _id as an object — convert to string for GraphQL
const mapUser = (u) => u ? ({
  id: String(u._id || u.id),
  username: u.username,
  email: u.email
}) : null;

const mapProduct = (p) => p ? ({
  id: String(p._id || p.id),
  name: p.name,
  description: p.description,
  price: p.price
}) : null;

const mapOrder = (o) => o ? ({
  id: String(o._id || o.id),
  productId: String(o.productId),
  userId: String(o.userId),
  quantity: o.quantity,
  status: o.status
}) : null;

const resolvers = {
  Query: {
    getUsers: async () => {
      const response = await axios.get(`${USER_SERVICE_URL}/users`);
      return response.data.map(mapUser);
    },
    getUser: async (_, { id }) => {
      const response = await axios.get(`${USER_SERVICE_URL}/users/${id}`);
      return mapUser(response.data);
    },
    getProducts: async () => {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
      return response.data.map(mapProduct);
    },
    getProduct: async (_, { id }) => {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${id}`);
      return mapProduct(response.data);
    },
    getOrders: async () => {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders`);
      return response.data.map(mapOrder);
    },
    getOrder: async (_, { id }) => {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${id}`);
      return mapOrder(response.data);
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      const response = await axios.post(`${USER_SERVICE_URL}/users/register`, { username, email, password });
      return {
        id: String(response.data.userId),
        username,
        email,
      };
    },
    createProduct: async (_, { name, description, price }) => {
      const response = await axios.post(`${PRODUCT_SERVICE_URL}/products`, { name, description, price });
      return mapProduct(response.data.product);
    },
    createOrder: async (_, { productId, userId, quantity }) => {
      const response = await axios.post(`${ORDER_SERVICE_URL}/orders`, { productId, userId, quantity });
      return mapOrder(response.data);
    },
  },
};

module.exports = resolvers;
