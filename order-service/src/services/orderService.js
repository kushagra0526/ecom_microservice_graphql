const Order = require('../models/orderModel');

// Create a new order
exports.createOrder = async (orderData) => {
  try {
    const order = new Order(orderData);
    await order.save();
    return order;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

// Get all orders
exports.getAllOrders = async () => {
  try {
    return await Order.find();
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

// Get order by ID
exports.getOrderById = async (id) => {
  try {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');
    return order;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};
