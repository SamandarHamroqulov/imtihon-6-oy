import Joi from "joi";

export const createCommentValidator = Joi.object({
    commentText: Joi.string().trim().min(1).max(1000).required().messages({
        "string.empty": "Comment bo'sh bo'lishi mumkin emas",
        "string.min": "Comment kamida 1 ta belgi bo'lishi kerak",
        "string.max": "Comment 1000 ta belgidan oshmasligi kerak",
        "any.required": "Comment matni kiritilishi shart",
    }),
    rating: Joi.number().integer().min(1).max(5).optional().messages({
        "number.base": "Reyting son bo'lishi kerak",
        "number.min": "Reyting 1 dan kam bo'lishi mumkin emas",
        "number.max": "Reyting 5 dan oshishi mumkin emas",
    }),
});

export const updateCommentValidator = Joi.object({
    commentText: Joi.string().trim().min(1).max(1000).messages({
        "string.empty": "Comment bo'sh bo'lishi mumkin emas",
        "string.max": "Comment 1000 ta belgidan oshmasligi kerak",
    }),
    rating: Joi.number().integer().min(1).max(5).optional().allow(null).messages({
        "number.min": "Reyting 1 dan kam bo'lishi mumkin emas",
        "number.max": "Reyting 5 dan oshishi mumkin emas",
    }),
}).min(1); 