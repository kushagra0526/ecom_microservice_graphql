const Order = require('../models/orderModel');
const { produceOrderEvent } = require('../events/orderProducer');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const TIMEOUT = 3000;

exports.createOrder = async (req, res, next) => {
  try {
    const { productId, userId, quantity } = req.body;

    // Validate product and user exist — forward auth token so protected routes don't reject
    const authHeader = req.headers.authorization
      ? { headers: { Authorization: req.headers.authorization } }
      : {};
    try {
      await Promise.all([
        axios.get(`${USER_SERVICE_URL}/users/${userId}`, { timeout: TIMEOUT, ...authHeader }),
        axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`, { timeout: TIMEOUT, ...authHeader }),
      ]);
    } catch (err) {
      if (!err.response)
        return res.status(503).json({ message: 'A required service is unreachable. Please try again later.' });
      if (err.response.status === 401)
        return res.status(401).json({ message: 'Unauthorized. Please provide a valid token.' });
      const target = err.config.url.includes('users') ? 'User' : 'Product';
      return res.status(400).json({ message: `${target} with id '${err.config.url.split('/').pop()}' does not exist.` });
    }

    const newOrder = new Order({ productId, userId, quantity });
    await newOrder.save();

    // Emit Kafka event (non-blocking)
    produceOrderEvent(newOrder).catch(err =>
      console.error('Failed to emit order event:', err)
    );

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const [data, total] = await Promise.all([
      Order.find().skip(offset).limit(limit),
      Order.countDocuments(),
    ]);
    res.status(200).json({ data, total, limit, offset });
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

// Admin only — update order status (e.g. Pending → Completed)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Completed', 'Cancelled'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};
