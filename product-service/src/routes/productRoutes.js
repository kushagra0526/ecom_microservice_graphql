const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createProduct);          // protected — mutates data
router.get('/', getProducts);                   // public — product listing
router.get('/:id', getProductById);             // public — product detail
router.put('/:id', auth, updateProduct);        // protected — mutates data
router.delete('/:id', auth, deleteProduct);     // protected — mutates data

module.exports = router;
