"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoetModel = void 0;
const sequelize_1 = require("sequelize");
const db_service_1 = require("../../services/db.service");
exports.PoetModel = db_service_1.sequelize.define("Poet", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
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
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    birthDate: {
        type: sequelize_1.DATE,
        allowNull: false
    },
    deathDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    genre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: "poets"
});
