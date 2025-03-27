const express = require("express");
const { authenticateUser, isUser } = require("../middleware/authMiddleware");
const {
  proceedToCheckout,
  initiatePaypalPayment,
  paymentSuccess,
  paymentCancel,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/proceed-checkout", authenticateUser, isUser, proceedToCheckout);

router.post("/pay", authenticateUser, isUser, initiatePaypalPayment);
router.get("/payment/success", paymentSuccess);
router.get("/payment/cancel", paymentCancel);

module.exports = router;
