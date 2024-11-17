const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware());
router.post('/addAddress', userController.addAddress);
router.delete('/deleteAddress/:addressId', userController.deleteAddress);
router.get('/transactions', userController.viewTransactions);
router.post("/redeem", userController.redeemVoucher);

module.exports = router;