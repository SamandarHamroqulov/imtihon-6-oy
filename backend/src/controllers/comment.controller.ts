import { Request, Response } from "express";
import { BookModel } from "../models/Book/Book.model";
import { CommentModel } from "../models/Comment/Comment.model";
import { UserModel } from "../models/User/User.model";
import { createCommentValidator, updateCommentValidator } from "../helpers/validators/comment.validator";

export async function GET_BOOK_COMMENTS(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        const book = await BookModel.findByPk(Number(bookId));
        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }
        const comments = await CommentModel.findAll({
            where: {
                bookId: Number(bookId)
            },
            include: [
                {
                    model: UserModel,
                    attributes: ["id", "firstname", "lastname"]
                }
            ]
        })
        const ratings = comments.map((comment: any) => comment.rating).filter((r: any) => r != null && r !== undefined)
        const averageRating = ratings.length > 0 ? ratings.reduce((a: any, b: any) => a + b) / ratings.length : 0



        return res.status(200).json({
            data: comments,
            total: comments.length,
            averageRating,
        });
    } catch (err: any) {
        return res
            .status(500)
            .json({ message: "GET_BOOK_COMMENTS ERROR", err: err.message });
    }
}
export async function CREATE_COMMENT(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        const userId = (req as any).user?.id;
        const { commentText, rating } = req.body;

        try {
            await createCommentValidator.validateAsync(req.body);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }

        const book = await BookModel.findByPk(Number(bookId));
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const existingComment = await CommentModel.findOne({
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

        const comment = await CommentModel.create({
            bookId: Number(bookId),
            userId,
            commentText,
            rating,
        });

        const fullComment = await CommentModel.findByPk(comment.dataValues.id, {
            include: [
                {
                    model: UserModel,
                    attributes: ["id", "firstname", "lastname"],
                },
            ],
        });

        return res.status(201).json({ data: fullComment });
    } catch (err: any) {
        return res.status(500).json({
            message: "CREATE_COMMENT ERROR",
            err: err.message,
        });
    }
}
export async function UPDATE_COMMENT(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const { commentText, rating } = req.body;
        await updateCommentValidator.validateAsync(req.body)
        const comment = await CommentModel.findByPk(Number(id));
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }
        const isOwner = comment.dataValues.userId === userId;
        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to update this comment" })
        }
        let updateComment: any = {}
        if (commentText) updateComment.commentText = commentText;
        if (rating !== undefined) updateComment.rating = rating;
        await comment.update(updateComment);
        let updated = await CommentModel.findByPk(comment.dataValues.id, {
            include: [
                {
                    model: UserModel,
                    attributes: ["id", "firstname", "lastname"]
                }
            ]

        })
        return res.status(200).json({
            message: "Comment muvaffaqiyatli yangilandi",
            data: updated,
        });
    } catch (err: any) {
        if (err.isJoi) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "UPDATE_COMMENT ERROR", err: err.message })

    }

}
export async function DELETE_COMMENT(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const comment = await CommentModel.findByPk(Number(id));
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }
        const isOwner = comment.dataValues.userId === userId;
        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" })
        }
        await comment.destroy();
        return res.status(200).json({ message: "Comment deleted successfully" })
    } catch (err: any) {
        return res.status(500).json({ message: "DELETE_COMMENT ERROR", err: err.message })

    }
}

export async function GET_MY_COMMENTS(req: Request, res: Response) {
    try {
        let userId = (req as any).user.id;
        const comments = await CommentModel.findAll({
            where: { userId },
            include: [
                {
                    model: BookModel,
                    attributes: ["id", "firstname", "lastname"]
                }
            ]
        })
        return res.status(200).json({ comments })
    } catch (err: any) {
        return res.status(500).json({ message: "GET_MY_COMMENTS ERROR", err: err.message })
    }

}