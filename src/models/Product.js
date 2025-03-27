const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
      min: 0,
      set: (val) =>
        mongoose.Types.Decimal128.fromString(parseFloat(val).toFixed(2)),
      get: (val) => parseFloat(val.toString()),
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      transform: (doc, ret) => {
        const baseUrl = process.env.BASE_URL;
        if (ret.images && ret.images.length > 0) {
          ret.images = ret.images.map(
            (img) => `${baseUrl}/${img.replace(/\\/g, "/")}`
          );
        }
        return ret;
      },
    },
    toObject: { getters: true },
  }
);

module.exports = mongoose.model("Product", productSchema);
