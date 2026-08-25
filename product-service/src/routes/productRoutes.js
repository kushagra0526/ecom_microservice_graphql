const express = require('express');
const { createProduct, getProducts, getProductById } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createProduct);    // protected — mutates data
router.get('/', getProducts);             // public — product listing
router.get('/:id', getProductById);       // public — product detail

module.exports = router;
