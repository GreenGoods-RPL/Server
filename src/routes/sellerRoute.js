const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");

router.get("/:sellerId", sellerController.viewProfile);
// router.get("/seller/:sellerId/orders", viewProfile);

module.exports = router;
