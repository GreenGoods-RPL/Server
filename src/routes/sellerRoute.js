const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

router.use(authMiddleware());
router.use(sellerMiddleware);
router.get("/viewProfile", sellerController.viewProfile);
router.get("/orders", sellerController.viewOrders);

module.exports = router;
