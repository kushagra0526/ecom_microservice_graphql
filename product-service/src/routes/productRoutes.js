const express = require('express');
const Joi = require('joi');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
    name: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),
    price: Joi.number().positive().required(),
});

const updateSchema = Joi.object({
    name: Joi.string().trim().min(1),
    description: Joi.string().trim().min(1),
    price: Joi.number().positive(),
}).min(1); // at least one field required on update

const router = express.Router();

router.post('/', auth, validate(createSchema), createProduct);         // protected
router.get('/', getProducts);                                          // public
router.get('/:id', getProductById);                                    // public
router.put('/:id', auth, validate(updateSchema), updateProduct);       // protected
router.delete('/:id', auth, deleteProduct);                            // protected

module.exports = router;
