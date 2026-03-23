import { DataTypes } from "sequelize";
import { sequelize } from "../../services/db.service";

export const BookshelfItemModel = sequelize.define("BookshelfItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bookshelfId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "bookshelves", key: "id" }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "books", key: "id" }
  }
}, {
  tableName: "bookshelf_items",
  timestamps: true
});