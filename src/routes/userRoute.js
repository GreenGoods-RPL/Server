const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware());
router.post("/addAddress", userController.addAddress);
router.post("/addAddress", userController.addAddress);
router.post("/purchase", userController.purchaseProduct);
router.post("/completeTransaction", userController.completeTransaction);
router.post("/redeem", userController.redeemVoucher);
router.delete("/deleteAddress/:addressId", userController.deleteAddress);
router.get("/transactions", userController.viewTransactions);

module.exports = router;
