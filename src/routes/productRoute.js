const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const sellerMiddleware = require('../middleware/sellerMiddleware');

router.get('/search', productController.searchProducts);
router.get('/filter', productController.filterProducts);
router.get('/:id', productController.getProductById);
router.get('/', productController.getProducts);

router.use(authMiddleware());
router.use(sellerMiddleware);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;