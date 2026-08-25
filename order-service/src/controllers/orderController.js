const Order = require('../models/orderModel');
const { produceOrderEvent } = require('../events/orderProducer');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const TIMEOUT = 3000;

exports.createOrder = async (req, res, next) => {
  try {
    const { productId, userId, quantity } = req.body;

    // Validate product and user exist — inner try/catch stays: these are intentional 400/503, not unhandled errors
    try {
      await Promise.all([
        axios.get(`${USER_SERVICE_URL}/users/${userId}`, { timeout: TIMEOUT }),
        axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`, { timeout: TIMEOUT }),
      ]);
    } catch (err) {
      if (!err.response)
        return res.status(503).json({ message: 'A required service is unreachable. Please try again later.' });
      const target = err.config.url.includes('users') ? 'User' : 'Product';
      return res.status(400).json({ message: `${target} with id '${err.config.url.split('/').pop()}' does not exist.` });
    }

    const newOrder = new Order({ productId, userId, quantity });
    await newOrder.save();
    produceOrderEvent(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
