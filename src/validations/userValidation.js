const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{6,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter, one number, and one special character (@$!%*?&).",
    }),
  address: Joi.object({
    street: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    state: Joi.string().allow("").optional(),
    zipcode: Joi.string().allow("").optional(),
    country: Joi.string().allow("").optional(),
  }).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
