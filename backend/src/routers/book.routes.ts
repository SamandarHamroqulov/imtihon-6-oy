import { Router } from "express";
import { ADD_TO_BOOKSHELF, CREATE_BOOK, DELETE_BOOK, GET_BOOK, GET_BOOKS, GET_BOOKSHELF, REMOVE_FROM_BOOKSHELF, UPDATE_BOOK } from "../controllers/book.controller";
import { uploadFile } from "../services/upload.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

export const bookRouter = Router()
bookRouter.post("/create",authMiddleware, adminMiddleware, uploadFile("books").single("cover_image"), CREATE_BOOK)
bookRouter.get("/all", authMiddleware,GET_BOOKS)
bookRouter.get("/bookshelf/all", authMiddleware, GET_BOOKSHELF);
bookRouter.post("/bookshelf/add",    authMiddleware, ADD_TO_BOOKSHELF);
bookRouter.delete("/bookshelf/remove", authMiddleware, REMOVE_FROM_BOOKSHELF);
bookRouter.route("/:id")
.get(authMiddleware,GET_BOOK)
.put(authMiddleware,adminMiddleware,UPDATE_BOOK)
.delete(authMiddleware,adminMiddleware,DELETE_BOOK)
