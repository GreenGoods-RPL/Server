const express = require("express");
const router = express.Router();
const { viewProfile } = require("../controllers/sellerController");

router.get("/seller/:sellerId", viewProfile);
// router.get("/seller/:sellerId/orders", viewProfile);

module.exports = router;
