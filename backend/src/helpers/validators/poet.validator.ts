import Joi from "joi";

export const createPoetValidator = Joi.object({
  firstname: Joi.string().required().trim().min(3).max(100).messages({
    "string.base": "Poet firstname must be a string",
    "string.empty": "Poet firstname must not be empty",
    "any.required": "Poet firstname is required",
  }),
  lastname: Joi.string().required().trim().min(3).max(100).messages({
    "string.base": "Poet lastname must be a string",
    "string.empty": "Poet lastname must not be empty",
    "any.required": "Poet lastname is required",
  }),
  country: Joi.string().required().trim().min(3).max(100).messages({
    "string.base": "Poet country must be a string",
    "string.empty": "Poet country must not be empty",
    "any.required": "Poet country is required",
  }),
  birthDate: Joi.date().required().messages({
    "date.base": "Poet birth date must be a date",
    "date.empty": "Poet birth date must not be empty",
    "any.required": "Poet birth date is required",
  }),
  deathDate: Joi.date().optional().messages({
    "date.base": "Poet death date must be a date",
    "date.empty": "Poet death date must not be empty",
  }),
  genre: Joi.string().required().trim().messages({
    "string.base": "Poet genre must be a string",
    "string.empty": "Poet genre must not be empty",
    "any.required": "Poet genre is required",
  }),
  bio: Joi.string().optional().trim().messages({
    "string.base": "Poet bio must be a string",
    "string.empty": "Poet bio must not be empty"
  }),
  image: Joi.string().uri().optional().messages({
    "string.base": "Poet image url must be a string",
    "string.empty": "Poet image url must not be empty"
  }),
});

export const updatePoetValidator = Joi.object({
  firstname: Joi.string().trim().min(3).max(100),
  lastname: Joi.string().trim().min(3).max(100),
  country: Joi.string().trim().min(3).max(100),
  birthDate: Joi.date(),
  deathDate: Joi.date().greater(Joi.ref("birthDate")).messages({
    "date.greater": "Death date must be after birth date",
  }),
  genre: Joi.string().trim().min(2).max(100),
  bio: Joi.string().trim(),
  image: Joi.string().uri().messages({
    "string.uri": "Poet image must be a valid URL",
  }),
}).min(1);