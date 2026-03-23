import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CREATE_COMMENT, DELETE_COMMENT, GET_BOOK_COMMENTS, GET_MY_COMMENTS, UPDATE_COMMENT } from "../controllers/comment.controller";

export const commentRouter = Router()

commentRouter.get("/my", authMiddleware, GET_MY_COMMENTS)
commentRouter.get("/:bookId", authMiddleware, GET_BOOK_COMMENTS)
commentRouter.post("/:bookId", authMiddleware, CREATE_COMMENT)
commentRouter.put("/:id", authMiddleware, UPDATE_COMMENT)
commentRouter.delete("/:id", authMiddleware, DELETE_COMMENT)