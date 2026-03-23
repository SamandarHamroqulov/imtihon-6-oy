"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookValidator = exports.createBookValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createBookValidator = joi_1.default.object({
    title: joi_1.default.string()
        .min(2)
        .max(150)
        .required()
        .messages({
        "string.empty": "Book name must not be empty",
        "any.required": "Book name is required"
    }),
    description: joi_1.default.string()
        .max(1000)
        .allow("", null),
    cover_image: joi_1.default.string()
        .allow("", null),
    price: joi_1.default.number()
        .min(0)
        .allow(null)
        .messages({
        "number.base": "Price must be a number"
    }),
    poetId: joi_1.default.number()
        .integer()
        .required()
        .messages({
        "number.base": "Poet id must be a number",
        "any.required": "The book must be dedicated to a poet."
    }),
    genre: joi_1.default.string()
        .required()
        .messages({
        "string.empty": "Genre must not be empty",
        "any.required": "Genre is required"
    })
});
exports.updateBookValidator = joi_1.default.object({
    title: joi_1.default.string().min(2).max(150),
    description: joi_1.default.string().max(1000).allow("", null),
    cover_image: joi_1.default.string().allow("", null),
    price: joi_1.default.number().min(0).allow(null),
    poetId: joi_1.default.number().integer(),
    genre: joi_1.default.string().max(50)
});
