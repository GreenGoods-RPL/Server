const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware());
router.get("/", userController.viewProfile);
router.get("/transactions", userController.viewTransactions);
router.post("/purchase", userController.purchaseProduct);
router.post("/completeTransaction", userController.completeTransaction);
router.post("/redeem", userController.redeemVoucher);
router.post("/addAddress", userController.addAddress);
router.delete("/deleteAddress/:addressId", userController.deleteAddress);

module.exports = router;
