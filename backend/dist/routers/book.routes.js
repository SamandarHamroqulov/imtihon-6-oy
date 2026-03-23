"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const upload_service_1 = require("../services/upload.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin_middleware_1 = require("../middlewares/admin.middleware");
exports.bookRouter = (0, express_1.Router)();
exports.bookRouter.post("/create", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, (0, upload_service_1.uploadFile)("books").single("cover_image"), book_controller_1.CREATE_BOOK);
exports.bookRouter.get("/all", auth_middleware_1.authMiddleware, book_controller_1.GET_BOOKS);
exports.bookRouter.get("/bookshelf/all", auth_middleware_1.authMiddleware, book_controller_1.GET_BOOKSHELF);
exports.bookRouter.post("/bookshelf/add", auth_middleware_1.authMiddleware, book_controller_1.ADD_TO_BOOKSHELF);
exports.bookRouter.delete("/bookshelf/remove", auth_middleware_1.authMiddleware, book_controller_1.REMOVE_FROM_BOOKSHELF);
exports.bookRouter.route("/:id")
    .get(auth_middleware_1.authMiddleware, book_controller_1.GET_BOOK)
    .put(auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, book_controller_1.UPDATE_BOOK)
    .delete(auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, book_controller_1.DELETE_BOOK);
