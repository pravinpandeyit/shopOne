const Joi = require("joi");

const cartValidation = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
});

module.exports = cartValidation;
