const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().precision(2).required(),
  categoryId: Joi.string().required(),
  stock: Joi.string().required(),
});

const imageValidation = Joi.object({
  productId: Joi.string().required(),
  imageUrl: Joi.string().required(),
});

module.exports = { productSchema, imageValidation };
