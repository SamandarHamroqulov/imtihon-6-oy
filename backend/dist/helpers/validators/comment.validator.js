"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentValidator = exports.createCommentValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCommentValidator = joi_1.default.object({
    commentText: joi_1.default.string().trim().min(1).max(1000).required().messages({
        "string.empty": "Comment bo'sh bo'lishi mumkin emas",
        "string.min": "Comment kamida 1 ta belgi bo'lishi kerak",
        "string.max": "Comment 1000 ta belgidan oshmasligi kerak",
        "any.required": "Comment matni kiritilishi shart",
    }),
    rating: joi_1.default.number().integer().min(1).max(5).optional().messages({
        "number.base": "Reyting son bo'lishi kerak",
        "number.min": "Reyting 1 dan kam bo'lishi mumkin emas",
        "number.max": "Reyting 5 dan oshishi mumkin emas",
    }),
});
exports.updateCommentValidator = joi_1.default.object({
    commentText: joi_1.default.string().trim().min(1).max(1000).messages({
        "string.empty": "Comment bo'sh bo'lishi mumkin emas",
        "string.max": "Comment 1000 ta belgidan oshmasligi kerak",
    }),
    rating: joi_1.default.number().integer().min(1).max(5).optional().allow(null).messages({
        "number.min": "Reyting 1 dan kam bo'lishi mumkin emas",
        "number.max": "Reyting 5 dan oshishi mumkin emas",
    }),
}).min(1);
