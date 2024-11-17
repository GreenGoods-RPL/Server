const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/products', adminController.getAllNewProducts);
router.put('/accept/:productId', adminController.acceptNewProduct);
router.put('/reject/:productId', adminController.rejectNewProduct);

module.exports = router;