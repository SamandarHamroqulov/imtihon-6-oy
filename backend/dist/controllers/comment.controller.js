"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_BOOK_COMMENTS = GET_BOOK_COMMENTS;
exports.CREATE_COMMENT = CREATE_COMMENT;
exports.UPDATE_COMMENT = UPDATE_COMMENT;
exports.DELETE_COMMENT = DELETE_COMMENT;
exports.GET_MY_COMMENTS = GET_MY_COMMENTS;
const Book_model_1 = require("../models/Book/Book.model");
const Comment_model_1 = require("../models/Comment/Comment.model");
const User_model_1 = require("../models/User/User.model");
const comment_validator_1 = require("../helpers/validators/comment.validator");
async function GET_BOOK_COMMENTS(req, res) {
    try {
        const { bookId } = req.params;
        const book = await Book_model_1.BookModel.findByPk(Number(bookId));
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        const comments = await Comment_model_1.CommentModel.findAll({
            where: {
                bookId: Number(bookId)
            },
            include: [
                {
                    model: User_model_1.UserModel,
                    attributes: ["id", "firstname", "lastname"]
                }
            ]
        });
        const ratings = comments.map((comment) => comment.rating).filter((r) => r != null && r !== undefined);
        const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b) / ratings.length : 0;
        return res.status(200).json({
            data: comments,
            total: comments.length,
            averageRating,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "GET_BOOK_COMMENTS ERROR", err: err.message });
    }
}
async function CREATE_COMMENT(req, res) {
    try {
        const { bookId } = req.params;
        const userId = req.user?.id;
        const { commentText, rating } = req.body;
        try {
            await comment_validator_1.createCommentValidator.validateAsync(req.body);
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
        const book = await Book_model_1.BookModel.findByPk(Number(bookId));
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        const existingComment = await Comment_model_1.CommentModel.findOne({
            where: {
                bookId: Number(bookId),
                userId,
            },
        });
        if (existingComment) {
            return res.status(400).json({
                message: "Siz allaqachon izoh qoldirgansiz",
            });
        }
        const comment = await Comment_model_1.CommentModel.create({
            bookId: Number(bookId),
            userId,
            commentText,
            rating,
        });
        const fullComment = await Comment_model_1.CommentModel.findByPk(comment.dataValues.id, {
            include: [
                {
                    model: User_model_1.UserModel,
                    attributes: ["id", "firstname", "lastname"],
                },
            ],
        });
        return res.status(201).json({ data: fullComment });
    }
    catch (err) {
        return res.status(500).json({
            message: "CREATE_COMMENT ERROR",
            err: err.message,
        });
    }
}
async function UPDATE_COMMENT(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { commentText, rating } = req.body;
        await comment_validator_1.updateCommentValidator.validateAsync(req.body);
        const comment = await Comment_model_1.CommentModel.findByPk(Number(id));
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const isOwner = comment.dataValues.userId === userId;
        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to update this comment" });
        }
        let updateComment = {};
        if (commentText)
            updateComment.commentText = commentText;
        if (rating !== undefined)
            updateComment.rating = rating;
        await comment.update(updateComment);
        let updated = await Comment_model_1.CommentModel.findByPk(comment.dataValues.id, {
            include: [
                {
                    model: User_model_1.UserModel,
                    attributes: ["id", "firstname", "lastname"]
                }
            ]
        });
        return res.status(200).json({
            message: "Comment muvaffaqiyatli yangilandi",
            data: updated,
        });
    }
    catch (err) {
        if (err.isJoi) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "UPDATE_COMMENT ERROR", err: err.message });
    }
}
async function DELETE_COMMENT(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const comment = await Comment_model_1.CommentModel.findByPk(Number(id));
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const isOwner = comment.dataValues.userId === userId;
        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        await comment.destroy();
        return res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "DELETE_COMMENT ERROR", err: err.message });
    }
}
async function GET_MY_COMMENTS(req, res) {
    try {
        let userId = req.user.id;
        const comments = await Comment_model_1.CommentModel.findAll({
            where: { userId },
            include: [
                {
                    model: Book_model_1.BookModel,
                    attributes: ["id", "firstname", "lastname"]
                }
            ]
        });
        return res.status(200).json({ comments });
    }
    catch (err) {
        return res.status(500).json({ message: "GET_MY_COMMENTS ERROR", err: err.message });
    }
}
