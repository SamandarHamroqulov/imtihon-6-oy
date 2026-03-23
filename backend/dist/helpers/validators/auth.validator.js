"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = exports.resetPasswordValidator = exports.forgotPassValidator = exports.loginValidator = exports.resendOtpValidator = exports.verifyUserValidator = exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerValidator = joi_1.default.object({
    firstname: joi_1.default.string().required().trim().min(3).max(60).messages({
        "string.base": "Firstname must be a string",
        "string.empty": "Firstname must not be empty",
        "any.required": "Firstname is required",
    }),
    lastname: joi_1.default.string().required().trim().min(3).max(60).messages({
        "string.base": "Lastname must be a string",
        "string.empty": "Lastname must not be empty",
        "any.required": "Lastname is required",
    }),
    email: joi_1.default.string().required().trim().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email must not be empty",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().required().trim().min(6).messages({
        "string.base": "Password must be a string",
        "string.empty": "Password must not be empty",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});
exports.verifyUserValidator = joi_1.default.object({
    email: joi_1.default.string().required().trim().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email must not be empty",
        "any.required": "Email is required",
    }),
    otp: joi_1.default.number().integer().required().messages({
        "number.base": "Verification code must be a number",
        "number.integer": "Verification code must be an integer",
        "any.required": "Verification code is required",
    }),
});
exports.resendOtpValidator = joi_1.default.object({
    email: joi_1.default.string().required().trim().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email must not be empty",
        "any.required": "Email is required",
    }),
});
exports.loginValidator = joi_1.default.object({
    email: joi_1.default.string().required().trim().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email must not be empty",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().required().trim().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password must not be empty",
        "any.required": "Password is required",
    }),
});
exports.forgotPassValidator = joi_1.default.object({
    email: joi_1.default.string().required().trim().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email must not be empty",
        "any.required": "Email is required",
    }),
});
exports.resetPasswordValidator = joi_1.default.object({
    email: joi_1.default.string().required().trim().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email must not be empty",
        "any.required": "Email is required",
    }),
    otp: joi_1.default.number().integer().required().messages({
        "number.base": "Verification code must be a number",
        "number.integer": "Verification code must be an integer",
        "any.required": "Verification code is required",
    }),
    newPassword: joi_1.default.string().required().trim().min(6).messages({
        "string.base": "Password must be a string",
        "string.empty": "Password must not be empty",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});
exports.changePasswordValidator = joi_1.default.object({
    password: joi_1.default.string().required().trim().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password must not be empty",
        "any.required": "Old password is required",
    }),
    newPassword: joi_1.default.string().required().trim().min(6).messages({
        "string.base": "Password must be a string",
        "string.empty": "Password must not be empty",
        "string.min": "Password must be at least 6 characters",
        "any.required": "New password is required",
    }),
});
