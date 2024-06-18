const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/', productController.addProduct);
router.get('/:id', productController.getProduct);

module.exports = router;
