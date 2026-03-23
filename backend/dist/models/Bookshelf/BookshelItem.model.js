"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookshelfItemModel = void 0;
const sequelize_1 = require("sequelize");
const db_service_1 = require("../../services/db.service");
exports.BookshelfItemModel = db_service_1.sequelize.define("BookshelfItem", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bookshelfId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "bookshelves", key: "id" }
    },
    bookId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "books", key: "id" }
    }
}, {
    tableName: "bookshelf_items",
    timestamps: true
});
