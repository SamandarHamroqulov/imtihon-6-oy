import { Request, Response } from "express";
import { PoetModel } from "../models/Poet/Poet.model";
import { BookModel } from "../models/Book/Book.model";
import {
  createBookValidator,
  updateBookValidator,
} from "../helpers/validators/book.vaildator";
import { BookshelfItemModel } from "../models/Bookshelf/BookshelItem.model";
import { BookshelfModel } from "../models/Bookshelf/Bookshelf.Model";
export async function CREATE_BOOK(req: Request, res: Response) {
  try {
    let newBook = req.body;
    if (req.file) {
      newBook.cover_image = req.file.path.replace(/\\/g, "/");
    }
    await createBookValidator.validateAsync(newBook);

    if (!newBook.poetId) {
      return res.status(400).json({ message: "poetId is required" });
    }

    let poet = await PoetModel.findByPk(newBook.poetId);
    if (!poet) {
      return res.status(404).json({ message: "Poet not found" });
    }

    const book = await BookModel.create(newBook);

    return res.status(201).json({
      message: "Book successfully created",
      data: book,
    });
  } catch (err: any) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "CREATE_BOOK"
    });
  }
}
import { Op } from "sequelize";

export async function GET_BOOKS(req: Request, res: Response) {
  try {
    const { genre, search } = req.query;
    const where: any = {};

    if (genre && typeof genre === 'string' && genre !== "all") {
      where.genre = genre;
    }

    if (search && typeof search === 'string') {
      where.title = { [Op.like]: `%${search}%` };
    }

    let books = await BookModel.findAll({
      where,
      include: [
        {
          model: PoetModel,
          attributes: ["firstname", "lastname", "genre"],
        },
      ],
    });
    return res.status(200).json({ data: books });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "GET_BOOKS"
    });
  }
}

export async function GET_BOOK(req: Request, res: Response) {
  try {
    let { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    let book = await BookModel.findByPk(Number(id), {
      include: [
        {
          model: PoetModel,
          attributes: ["firstname", "lastname", "genre"],
        },
      ],
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ book: book });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "GET_BOOK"
    });
  }
}
export async function UPDATE_BOOK(req: Request, res: Response) {
  try {
    let { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    let data = req.body;

    if (req.file) {
      data.cover_image = req.file.path.replace(/\\/g, "/");
    }

    await updateBookValidator.validateAsync(data);

    let findBook = await BookModel.findByPk(Number(id));
    if (!findBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    await findBook.update(data);

    return res.status(200).json({
      message: "Book successfully updated",
      data: findBook,
    });
  } catch (err: any) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "UPDATE_BOOK"
    });
  }
}

export async function DELETE_BOOK(req: Request, res: Response) {
  try {
    let { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    let findBook = await BookModel.findByPk(Number(id));
    if (!findBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    await findBook.destroy();
    return res.status(200).json({ message: "Book successfully deleted" });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "DELETE_BOOK"
    });
  }
}

export async function ADD_TO_BOOKSHELF(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bookId } = req.body;
    if (!bookId || Number.isNaN(Number(bookId))) {
      return res.status(400).json({ message: "Invalid bookId provided" });
    }

    const [shelf] = await BookshelfModel.findOrCreate({
      where: { userId },
      defaults: { userId, name: "My Bookshelf" },
    });

    const bookshelfId = (shelf as any).id;

    const alreadyAdded = await BookshelfItemModel.findOne({
      where: { bookId, bookshelfId },
    });

    if (alreadyAdded) {
      return res
        .status(400)
        .json({ message: "This book is already in your bookshelf" });
    }

    await BookshelfItemModel.create({ bookId, bookshelfId });

    return res.status(200).json({
      message: "Book successfully added to your bookshelf!",
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message,
      controller: "ADD_TO_BOOKSHELF"
    });
  }
}

export async function REMOVE_FROM_BOOKSHELF(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bookId } = req.body;
    if (!bookId || Number.isNaN(Number(bookId))) {
      return res.status(400).json({ message: "Invalid bookId provided" });
    }

    const shelf = await BookshelfModel.findOne({ where: { userId } });
    if (!shelf) {
      return res.status(404).json({ message: "Bookshelf not found" });
    }

    const bookshelfId = (shelf as any).id;
    const deleted = await BookshelfItemModel.destroy({
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
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "REMOVE_FROM_BOOKSHELF"
    });
  }
}

export async function GET_BOOKSHELF(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const shelf = await BookshelfModel.findOne({
      where: { userId },
      include: [
        {
          model: BookModel,
          include: [{ model: PoetModel, attributes: ["firstname", "lastname", "bio", "genre"] }],
        },
      ],
    });

    if (!shelf) {
      return res.status(200).json({ data: [] });
    }

    return res.status(200).json({ data: (shelf as any).Books || [] });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "GET_BOOKSHELF"
    });
  }
}
