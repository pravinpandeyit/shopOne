const express = require("express");
const { addToCart, cartList, removeCartItem, clearCart } = require("../controllers/cartController");
const { authenticateUser, isUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add-to-cart", authenticateUser, isUser, addToCart);
router.get("/cart-list", authenticateUser, isUser, cartList);
router.put("/remove-cart-item", authenticateUser, isUser, removeCartItem);
router.delete("/clear-cart", authenticateUser, isUser, clearCart);

module.exports = router;
