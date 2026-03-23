import Joi from "joi";

export const registerValidator = Joi.object({
  firstname: Joi.string().required().trim().min(3).max(60).messages({
    "string.base": "Firstname must be a string",
    "string.empty": "Firstname must not be empty",
    "any.required": "Firstname is required",
  }),
  lastname: Joi.string().required().trim().min(3).max(60).messages({
    "string.base": "Lastname must be a string",
    "string.empty": "Lastname must not be empty",
    "any.required": "Lastname is required",
  }),
  email: Joi.string().required().trim().email().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().trim().min(6).messages({
    "string.base": "Password must be a string",
    "string.empty": "Password must not be empty",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const verifyUserValidator = Joi.object({
  email: Joi.string().required().trim().email().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "any.required": "Email is required",
  }),
  otp: Joi.number().integer().required().messages({
    "number.base": "Verification code must be a number",
    "number.integer": "Verification code must be an integer",
    "any.required": "Verification code is required",
  }),
});

export const resendOtpValidator = Joi.object({
  email: Joi.string().required().trim().email().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "any.required": "Email is required",
  }),
});

export const loginValidator = Joi.object({
  email: Joi.string().required().trim().email().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().trim().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password must not be empty",
    "any.required": "Password is required",
  }),
});

export const forgotPassValidator = Joi.object({
  email: Joi.string().required().trim().email().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "any.required": "Email is required",
  }),
});

export const resetPasswordValidator = Joi.object({
  email: Joi.string().required().trim().email().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "any.required": "Email is required",
  }),
  otp: Joi.number().integer().required().messages({
    "number.base": "Verification code must be a number",
    "number.integer": "Verification code must be an integer",
    "any.required": "Verification code is required",
  }),
  newPassword: Joi.string().required().trim().min(6).messages({
    "string.base": "Password must be a string",
    "string.empty": "Password must not be empty",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const changePasswordValidator = Joi.object({
  password: Joi.string().required().trim().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password must not be empty",
    "any.required": "Old password is required",
  }),
  newPassword: Joi.string().required().trim().min(6).messages({
    "string.base": "Password must be a string",
    "string.empty": "Password must not be empty",
    "string.min": "Password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});