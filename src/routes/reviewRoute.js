const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:productId', reviewController.getReviews);
router.use(authMiddleware());
router.post('/', reviewController.createReview);

module.exports = router;