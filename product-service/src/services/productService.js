const Product = require('../models/productModel');
const { KafkaClient, Producer } = require('kafka-node');

const client = new KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new Producer(client);

// Create a new product
exports.createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    return product;
  } catch (err) {
    throw new Error(`Error creating product: ${err.message}`);
  }
};

// Get all products
exports.getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (err) {
    throw new Error(`Error fetching products: ${err.message}`);
  }
};

// Get a product by ID
exports.getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (err) {
    throw new Error(`Error fetching product by ID: ${err.message}`);
  }
};

// Update a product by ID (Optional feature)
exports.updateProduct = async (id, updatedData) => {
  try {
    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (err) {
    throw new Error(`Error updating product: ${err.message}`);
  }
};

// Delete a product by ID (Optional feature)
exports.deleteProduct = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (err) {
    throw new Error(`Error deleting product: ${err.message}`);
  }
};
