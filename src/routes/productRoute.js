const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const sellerMiddleware = require('../middleware/sellerMiddleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/search', );

router.use(authMiddleware());
router.use(sellerMiddleware);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;