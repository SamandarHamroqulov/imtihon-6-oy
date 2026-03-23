"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const sequelize_1 = require("sequelize");
const db_service_1 = require("../../services/db.service");
exports.BookModel = db_service_1.sequelize.define("Book", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    cover_image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    poetId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    genre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "books",
    timestamps: true
});
