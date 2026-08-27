const Product = require('../models/productModel');
const { emitProductCreatedEvent } = require('../events/productProducer');

exports.createProduct = async (req, res, next) => {
  try {
    // Attach the seller's userId so ownership can be enforced on edit/delete
    const product = await Product.create({ ...req.body, createdBy: req.user.userId });

    emitProductCreatedEvent(product).catch(err =>
      console.error('Failed to emit product event:', err)
    );

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

// Ownership check helper — admin can always edit, seller only if they created it
const canModify = (product, user) =>
  user.role === 'admin' || String(product.createdBy) === String(user.userId);

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!canModify(product, req.user))
      return res.status(403).json({ message: 'You can only edit your own products.' });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!canModify(product, req.user))
      return res.status(403).json({ message: 'You can only delete your own products.' });

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
