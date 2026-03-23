"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookshelfRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const Bookshelf_Model_1 = require("../models/Bookshelf/Bookshelf.Model");
const Book_model_1 = require("../models/Book/Book.model");
const Poet_model_1 = require("../models/Poet/Poet.model");
exports.bookshelfRouter = (0, express_1.Router)();
exports.bookshelfRouter.use(auth_middleware_1.authMiddleware);
exports.bookshelfRouter.get("/my", async (req, res) => {
    try {
        const shelf = await Bookshelf_Model_1.BookshelfModel.findOne({
            where: { userId: req.user.id },
            include: [{
                    model: Book_model_1.BookModel,
                    include: [{ model: Poet_model_1.PoetModel, attributes: ["firstname", "lastname"] }],
                }],
        });
        if (!shelf)
            return res.status(404).json({ message: "Bookshelf not found" });
        return res.status(200).json({ shelf });
    }
    catch (err) {
        return res.status(500).json({ message: "GET_BOOKSHELF ERROR", err: err.message });
    }
});
