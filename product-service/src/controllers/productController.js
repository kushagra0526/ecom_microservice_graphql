const Product = require('../models/productModel');
const { emitProductCreatedEvent } = require('../events/productProducer');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    emitProductCreatedEvent(product);
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const [data, total] = await Promise.all([
      Product.find().skip(offset).limit(limit),
      Product.countDocuments(),
    ]);
    res.status(200).json({ data, total, limit, offset });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
