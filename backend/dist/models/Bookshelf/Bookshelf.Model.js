"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookshelfModel = void 0;
const sequelize_1 = require("sequelize");
const db_service_1 = require("../../services/db.service");
exports.BookshelfModel = db_service_1.sequelize.define("Bookshelf", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "My Bookshelf",
    },
}, {
    timestamps: true,
    tableName: "bookshelves"
});
