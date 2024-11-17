const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Get reviews for a specific product/course
router.get('/review/:productid', reviewController.getReviews);

// Create a new review
router.post('/review', reviewController.createReview);

module.exports = router;