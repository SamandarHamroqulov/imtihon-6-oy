"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
const db_service_1 = require("../../services/db.service");
const UserModel = db_service_1.sequelize.define("User", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    otpExpires: {
        type: sequelize_1.DataTypes.DATE
    },
    is_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("admin", "user"),
        defaultValue: "user"
    }
}, {
    timestamps: true,
    tableName: "users"
});
exports.UserModel = UserModel;
