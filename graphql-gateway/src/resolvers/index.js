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
  price: p.price,
  createdBy: p.createdBy ? String(p.createdBy) : null,
}) : null;

const mapOrder = (o) => o ? ({
  id: String(o._id || o.id),
  productId: String(o.productId),
  userId: String(o.userId),
  quantity: o.quantity,
  status: o.status
}) : null;

// Build auth header config for axios when a token is present
const authConfig = (authorization) =>
  authorization ? { headers: { Authorization: authorization } } : {};

const resolvers = {
  Query: {
    getUsers: async (_, __, { authorization }) => {
      const response = await axios.get(`${USER_SERVICE_URL}/users`, authConfig(authorization));
      return response.data.map(mapUser);
    },
    getUser: async (_, { id }, { authorization }) => {
      const response = await axios.get(`${USER_SERVICE_URL}/users/${id}`, authConfig(authorization));
      return mapUser(response.data);
    },
    getProducts: async (_, { limit = 20, offset = 0 }) => {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`, { params: { limit, offset } });
      return {
        data: response.data.data.map(mapProduct),
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
      };
    },
    getProduct: async (_, { id }) => {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${id}`);
      return mapProduct(response.data);
    },
    getOrders: async (_, { limit = 20, offset = 0 }, { authorization }) => {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders`, {
        params: { limit, offset },
        ...authConfig(authorization),
      });
      return {
        data: response.data.data.map(mapOrder),
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
      };
    },
    getOrder: async (_, { id }, { authorization }) => {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${id}`, authConfig(authorization));
      return mapOrder(response.data);
    },
  },
  Mutation: {
    // register is public — no token needed
    createUser: async (_, { username, email, password }) => {
      const response = await axios.post(`${USER_SERVICE_URL}/users/register`, { username, email, password });
      return {
        id: String(response.data.userId),
        username,
        email,
      };
    },
    createProduct: async (_, { name, description, price }, { authorization }) => {
      const response = await axios.post(
        `${PRODUCT_SERVICE_URL}/products`,
        { name, description, price },
        authConfig(authorization)
      );
      return mapProduct(response.data.product);
    },
    updateProduct: async (_, { id, ...fields }, { authorization }) => {
      const response = await axios.put(
        `${PRODUCT_SERVICE_URL}/products/${id}`,
        fields,
        authConfig(authorization)
      );
      return mapProduct(response.data.product);
    },
    deleteProduct: async (_, { id }, { authorization }) => {
      await axios.delete(`${PRODUCT_SERVICE_URL}/products/${id}`, authConfig(authorization));
      return 'Product deleted successfully';
    },
    createOrder: async (_, { productId, userId, quantity }, { authorization }) => {
      const response = await axios.post(
        `${ORDER_SERVICE_URL}/orders`,
        { productId, userId, quantity },
        authConfig(authorization)
      );
      return mapOrder(response.data);
    },
  },
};

module.exports = resolvers;
