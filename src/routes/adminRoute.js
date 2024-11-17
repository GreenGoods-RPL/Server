const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware());
router.use(adminMiddleware);
router.get('/products', adminController.getAllNewProducts);
router.put('/accept/:productId', adminController.acceptNewProduct);
router.put('/reject/:productId', adminController.rejectNewProduct);

module.exports = router;