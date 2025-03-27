const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const paypalService = require("../services/paypalService");

exports.proceedToCheckout = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const cart = await Cart.findOne({ userId: loggedInUser.userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found!" });
    }

    let updatedItems = [];
    let totalAmount = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (product.stock > 0) {
        item.price = product.price;
        updatedItems.push(item);
        totalAmount += item.price * item.quantity;
      }
    }

    cart.items = updatedItems;
    cart.totalAmount = totalAmount;
    await cart.save();

    const order = new Order({
      userId: loggedInUser.userId,
      items: cart.items,
      totalAmount: parseFloat(cart.totalAmount),
    });

    await order.save();

    return res.json({
      message: "Please make the payment to complete the order",
      orderID: order._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.initiatePaypalPayment = async (req, res) => {
  try {
    const { paymentType, orderId } = req.body;
    if (!paymentType) {
      return res.status(400).json({ message: "Payment Type is required" });
    }

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const loggedInUser = req.user;
    // console.log("checking",loggedInUser.userId);
    const order = await Order.findOne({
      _id: orderId,
      userId: loggedInUser.userId,
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found!" });
    }

    const amount = order.totalAmount;
    const description = "ShopOne Product Purchase...";

    const paymentUrl = await paypalService.createPayment(
      amount,
      description,
      orderId
    );
    res.json({ payment_url: paymentUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const { orderId, paymentId } = req.query;
    if (!orderId || !paymentId) {
      return res
        .status(400)
        .json({ message: "Order ID and Payment ID is required!" });
    }

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "Invalid Order ID!" });
    }

    order.paymentMethod = "paypal";
    order.transactionId = paymentId;
    order.status = "paid";
    await order.save();

    await Cart.deleteOne({ userId: order.userId });

    res.json({ message: "Order Completed!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.paymentCancel = (req, res) => {
  res.send("Payment Cancelled!");
};
