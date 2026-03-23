import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
});
async function dbConnection() {
  try {
    await sequelize.authenticate();
    console.log("Db succesfully connected");
    await import ("../models/index.js")
    
    await sequelize.sync({alter: true });
  } catch (err: any) {
    console.log({ message: "DB connection failed", err: err.message });
    throw new Error("DB connection failed");
  }
}
export {
    sequelize , dbConnection
}
