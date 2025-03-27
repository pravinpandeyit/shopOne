const Product = require("../models/Product");
const Cart = require("../models/Cart");
const cartValidation = require("../validations/cartValidation");
const { formatCart, calculateCartTotalAmount } = require("../utils/helper");

exports.addToCart = async (req, res) => {
  try {
    const { error } = cartValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const loggedInUser = req.user;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found!" });
    }

    let cart = await Cart.findOne({ userId: loggedInUser.userId }).select(
      "userId items totalAmount"
    );
    if (!cart) {
      cart = new Cart({
        userId: loggedInUser.userId,
        items: [],
        totalAmount: 0.0,
      });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    cart.totalAmount = calculateCartTotalAmount(cart);
    await cart.save();

    const formattedCart = formatCart(cart);

    res.json({ message: "Product added to cart", data: formattedCart });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.cartList = async (req, res) => {
  try {
    const loggedInUser = req.user;
    let warnings = [];

    const cart = await Cart.findOne({ userId: loggedInUser.userId }).select(
      "userId items totalAmount"
    );

    if (!cart) {
      return res.json({ message: "Cart List", data: [], warnings });
    }

    for (let item of cart.items) {
      const product = await Product.findById(item.productId).select(
        "stock name"
      );

      if (product.stock <= 0) {
        warnings.push(
          `Product ${product.name} is out of stock. Please remove to proceed!`
        );
      }
    }

    const formattedCart = formatCart(cart);

    res.json({ message: "Cart List", data: formattedCart, warnings });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required!" });
    }

    const loggedInUser = req.user;
    let cart = await Cart.findOne({ userId: loggedInUser.userId }).select(
      "userId items totalAmount"
    );
    if (!cart) {
      return res.status(400).json({ message: "Cart not found!" });
    }

    const updatedItems = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (updatedItems.length === cart.items.length) {
      return res.status(400).json({ message: "Item not found in the cart!" });
    }

    cart.items = updatedItems;
    cart.totalAmount = calculateCartTotalAmount(cart);
    await cart.save();

    const formattedCart = formatCart(cart);

    res.json({ message: "Item removed from cart", data: formattedCart });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const cart = await Cart.findOneAndDelete({ userId: loggedInUser.userId });
    if (!cart) {
      return res.status(400).json({ message: "No cart found!" });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};
