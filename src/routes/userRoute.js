const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware());
router.get("/", userController.viewProfile);
router.get("/transactions", userController.viewTransactions);
router.get("/vouchers", userController.getVouchers);
router.get("/addresses", userController.getAddresses);
router.post("/purchase", userController.purchaseProduct);
router.post("/completeTransaction/:transactionId", userController.completeTransaction);
router.post("/addAddress", userController.addAddress);
router.delete("/redeem", userController.redeemVoucher);
router.delete("/deleteAddress/:addressId", userController.deleteAddress);

module.exports = router;
