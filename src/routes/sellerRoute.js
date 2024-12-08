const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

router.use(authMiddleware());
router.use(sellerMiddleware);
router.get("/orders", sellerController.viewOrders);
router.get("/products", sellerController.getProductBySellerId);
router.get("/", sellerController.viewProfile);
router.put("/updateTransaction", sellerController.updateTransactionStatus);

module.exports = router;
