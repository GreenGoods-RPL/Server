const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/:userId/address', userController.addAddress);
router.delete('/:userId/address/:addressId', userController.deleteAddress);
router.get('/:userId/transactions', userController.viewTransactions);

module.exports = router;