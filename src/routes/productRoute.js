const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post("/redeem", productController.redeemVoucher);

module.exports = router;