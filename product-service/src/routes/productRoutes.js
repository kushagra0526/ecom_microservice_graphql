const express = require('express');
const { createProduct, getProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

// Route to create a new product
router.post('/', createProduct);

// Route to get all products
router.get('/', getProducts);

// Route to get a product by ID
router.get('/:id', getProductById);

module.exports = router;
