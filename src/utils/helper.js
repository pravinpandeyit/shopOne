module.exports.formatCart = (cart) => {
  if (!cart) return null;

  return {
    ...cart.toObject(),
    totalAmount: parseFloat(cart.totalAmount.toString()),
    items: cart.items.map((item) => ({
      ...item.toObject(),
      price: parseFloat(item.price.toString()),
    })),
  };
};

module.exports.calculateCartTotalAmount = (cart) => {
  return parseFloat(
    cart.items.reduce((total, item) => total + item.quantity * item.price, 0)
  );
};
