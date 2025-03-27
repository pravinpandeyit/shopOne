const { required } = require("joi");
const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: mongoose.Types.Decimal128,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: mongoose.Types.Decimal128,
      required: true,
      min: 0,
      set: (val) =>
        mongoose.Types.Decimal128.fromString(parseFloat(val).toFixed(2)),
      get: (val) => parseFloat(val.toString()),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
