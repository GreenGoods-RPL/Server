// init
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/auth/register/user', authController.registerUser);
router.post('/auth/register/seller', authController.registerSeller);
router.post('/auth/login', authController.login);
router.post('/user/:userId/address', authController.addAddress);
router.delete('/user/:userId/address/:addressId', authController.deleteAddress);
router.get('/user/:userId/transactions', authController.viewTransactions);

module.exports = router;