const Order = require('../models/orderModel');
const { produceOrderEvent } = require('../events/orderProducer');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { productId, userId, quantity } = req.body;

    const newOrder = new Order({ productId, userId, quantity });
    await newOrder.save();

    // Produce an order created event to Kafka
    produceOrderEvent(newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
