import Joi from "joi";

export const createBookValidator = Joi.object({
  title: Joi.string()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.empty": "Book name must not be empty",
      "any.required": "Book name is required"
    }),

  description: Joi.string()
    .max(1000)
    .allow("", null),

  cover_image: Joi.string()
    .allow("", null),

  price: Joi.number()
    .min(0)
    .allow(null)
    .messages({
      "number.base": "Price must be a number"
    }),

  poetId: Joi.number()
    .integer()
    .required()
    .messages({
      "number.base": "Poet id must be a number",
      "any.required": "The book must be dedicated to a poet."
    }),

  genre: Joi.string()
    .required()
    .messages({
      "string.empty": "Genre must not be empty",
      "any.required": "Genre is required"
    })
});

export const updateBookValidator = Joi.object({
  title: Joi.string().min(2).max(150),
  description: Joi.string().max(1000).allow("", null),
  cover_image: Joi.string().allow("", null),
  price: Joi.number().min(0).allow(null),
  poetId: Joi.number().integer(),
  genre: Joi.string().max(50)
});

