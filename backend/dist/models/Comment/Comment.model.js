"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const sequelize_1 = require("sequelize");
const db_service_1 = require("../../services/db.service");
exports.CommentModel = db_service_1.sequelize.define("Comment", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bookId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    commentText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    },
}, {
    timestamps: true,
    tableName: "comments"
});
