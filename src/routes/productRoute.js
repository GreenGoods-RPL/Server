// init
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/auth/register/user', authController.registerUser);
router.post('/auth/register/seller', authController.registerSeller);
router.post('/auth/login', authController.login);

module.exports = router;