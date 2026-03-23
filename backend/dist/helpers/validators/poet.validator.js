"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePoetValidator = exports.createPoetValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createPoetValidator = joi_1.default.object({
    firstname: joi_1.default.string().required().trim().min(3).max(100).messages({
        "string.base": "Poet firstname must be a string",
        "string.empty": "Poet firstname must not be empty",
        "any.required": "Poet firstname is required",
    }),
    lastname: joi_1.default.string().required().trim().min(3).max(100).messages({
        "string.base": "Poet lastname must be a string",
        "string.empty": "Poet lastname must not be empty",
        "any.required": "Poet lastname is required",
    }),
    country: joi_1.default.string().required().trim().min(3).max(100).messages({
        "string.base": "Poet country must be a string",
        "string.empty": "Poet country must not be empty",
        "any.required": "Poet country is required",
    }),
    birthDate: joi_1.default.date().required().messages({
        "date.base": "Poet birth date must be a date",
        "date.empty": "Poet birth date must not be empty",
        "any.required": "Poet birth date is required",
    }),
    deathDate: joi_1.default.date().optional().messages({
        "date.base": "Poet death date must be a date",
        "date.empty": "Poet death date must not be empty",
    }),
    genre: joi_1.default.string().required().trim().messages({
        "string.base": "Poet genre must be a string",
        "string.empty": "Poet genre must not be empty",
        "any.required": "Poet genre is required",
    }),
    bio: joi_1.default.string().optional().trim().messages({
        "string.base": "Poet bio must be a string",
        "string.empty": "Poet bio must not be empty"
    }),
    image: joi_1.default.string().uri().optional().messages({
        "string.base": "Poet image url must be a string",
        "string.empty": "Poet image url must not be empty"
    }),
});
exports.updatePoetValidator = joi_1.default.object({
    firstname: joi_1.default.string().trim().min(3).max(100),
    lastname: joi_1.default.string().trim().min(3).max(100),
    country: joi_1.default.string().trim().min(3).max(100),
    birthDate: joi_1.default.date(),
    deathDate: joi_1.default.date().greater(joi_1.default.ref("birthDate")).messages({
        "date.greater": "Death date must be after birth date",
    }),
    genre: joi_1.default.string().trim().min(2).max(100),
    bio: joi_1.default.string().trim(),
    image: joi_1.default.string().uri().messages({
        "string.uri": "Poet image must be a valid URL",
    }),
}).min(1);
