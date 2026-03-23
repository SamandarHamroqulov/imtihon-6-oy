"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_BOOK = CREATE_BOOK;
exports.GET_BOOKS = GET_BOOKS;
exports.GET_BOOK = GET_BOOK;
exports.UPDATE_BOOK = UPDATE_BOOK;
exports.DELETE_BOOK = DELETE_BOOK;
exports.ADD_TO_BOOKSHELF = ADD_TO_BOOKSHELF;
exports.REMOVE_FROM_BOOKSHELF = REMOVE_FROM_BOOKSHELF;
exports.GET_BOOKSHELF = GET_BOOKSHELF;
const Poet_model_1 = require("../models/Poet/Poet.model");
const Book_model_1 = require("../models/Book/Book.model");
const book_vaildator_1 = require("../helpers/validators/book.vaildator");
const BookshelItem_model_1 = require("../models/Bookshelf/BookshelItem.model");
const Bookshelf_Model_1 = require("../models/Bookshelf/Bookshelf.Model");
async function CREATE_BOOK(req, res) {
    try {
        let newBook = req.body;
        if (req.file) {
            newBook.cover_image = req.file.path.replace(/\\/g, "/");
        }
        await book_vaildator_1.createBookValidator.validateAsync(newBook);
        if (!newBook.poetId) {
            return res.status(400).json({ message: "poetId is required" });
        }
        let poet = await Poet_model_1.PoetModel.findByPk(newBook.poetId);
        if (!poet) {
            return res.status(404).json({ message: "Poet not found" });
        }
        const book = await Book_model_1.BookModel.create(newBook);
        return res.status(201).json({
            message: "Book successfully created",
            data: book,
        });
    }
    catch (err) {
        if (err.isJoi)
            return res.status(400).json({ message: err.message });
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "CREATE_BOOK"
        });
    }
}
const sequelize_1 = require("sequelize");
async function GET_BOOKS(req, res) {
    try {
        const { genre, search } = req.query;
        const where = {};
        if (genre && typeof genre === 'string' && genre !== "all") {
            where.genre = genre;
        }
        if (search && typeof search === 'string') {
            where.title = { [sequelize_1.Op.like]: `%${search}%` };
        }
        let books = await Book_model_1.BookModel.findAll({
            where,
            include: [
                {
                    model: Poet_model_1.PoetModel,
                    attributes: ["firstname", "lastname", "genre"],
                },
            ],
        });
        return res.status(200).json({ data: books });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "GET_BOOKS"
        });
    }
}
async function GET_BOOK(req, res) {
    try {
        let { id } = req.params;
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        let book = await Book_model_1.BookModel.findByPk(Number(id), {
            include: [
                {
                    model: Poet_model_1.PoetModel,
                    attributes: ["firstname", "lastname", "genre"],
                },
            ],
        });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ book: book });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "GET_BOOK"
        });
    }
}
async function UPDATE_BOOK(req, res) {
    try {
        let { id } = req.params;
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        let data = req.body;
        if (req.file) {
            data.cover_image = req.file.path.replace(/\\/g, "/");
        }
        await book_vaildator_1.updateBookValidator.validateAsync(data);
        let findBook = await Book_model_1.BookModel.findByPk(Number(id));
        if (!findBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        await findBook.update(data);
        return res.status(200).json({
            message: "Book successfully updated",
            data: findBook,
        });
    }
    catch (err) {
        if (err.isJoi)
            return res.status(400).json({ message: err.message });
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "UPDATE_BOOK"
        });
    }
}
async function DELETE_BOOK(req, res) {
    try {
        let { id } = req.params;
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        let findBook = await Book_model_1.BookModel.findByPk(Number(id));
        if (!findBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        await findBook.destroy();
        return res.status(200).json({ message: "Book successfully deleted" });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "DELETE_BOOK"
        });
    }
}
async function ADD_TO_BOOKSHELF(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { bookId } = req.body;
        if (!bookId || Number.isNaN(Number(bookId))) {
            return res.status(400).json({ message: "Invalid bookId provided" });
        }
        const [shelf] = await Bookshelf_Model_1.BookshelfModel.findOrCreate({
            where: { userId },
            defaults: { userId, name: "My Bookshelf" },
        });
        const bookshelfId = shelf.id;
        const alreadyAdded = await BookshelItem_model_1.BookshelfItemModel.findOne({
            where: { bookId, bookshelfId },
        });
        if (alreadyAdded) {
            return res
                .status(400)
                .json({ message: "This book is already in your bookshelf" });
        }
        await BookshelItem_model_1.BookshelfItemModel.create({ bookId, bookshelfId });
        return res.status(200).json({
            message: "Book successfully added to your bookshelf!",
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "ADD_TO_BOOKSHELF"
        });
    }
}
async function REMOVE_FROM_BOOKSHELF(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { bookId } = req.body;
        if (!bookId || Number.isNaN(Number(bookId))) {
            return res.status(400).json({ message: "Invalid bookId provided" });
        }
        const shelf = await Bookshelf_Model_1.BookshelfModel.findOne({ where: { userId } });
        if (!shelf) {
            return res.status(404).json({ message: "Bookshelf not found" });
        }
        const bookshelfId = shelf.id;
        const deleted = await BookshelItem_model_1.BookshelfItemModel.destroy({
            where: {
                bookId: bookId,
                bookshelfId: bookshelfId,
            },
        });
        if (!deleted) {
            return res.status(404).json({
                message: "This book was not found in your bookshelf",
            });
        }
        return res.status(200).json({
            message: "Book successfully removed from your bookshelf",
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "REMOVE_FROM_BOOKSHELF"
        });
    }
}
async function GET_BOOKSHELF(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const shelf = await Bookshelf_Model_1.BookshelfModel.findOne({
            where: { userId },
            include: [
                {
                    model: Book_model_1.BookModel,
                    include: [{ model: Poet_model_1.PoetModel, attributes: ["firstname", "lastname", "bio", "genre"] }],
                },
            ],
        });
        if (!shelf) {
            return res.status(200).json({ data: [] });
        }
        return res.status(200).json({ data: shelf.Books || [] });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "GET_BOOKSHELF"
        });
    }
}
