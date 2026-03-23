"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.dbConnection = dbConnection;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: "postgres",
    username: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
});
exports.sequelize = sequelize;
async function dbConnection() {
    try {
        await sequelize.authenticate();
        console.log("Db succesfully connected");
        await import("../models/index.js");
        await sequelize.sync({ alter: true });
    }
    catch (err) {
        console.log({ message: "DB connection failed", err: err.message });
        throw new Error("DB connection failed");
    }
}
