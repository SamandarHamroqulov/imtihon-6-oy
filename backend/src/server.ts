import "dotenv/config";
import cors from "cors";
import express from "express";
import { mainRouter } from "./routers/main.routes";
import { dbConnection } from "./services/db.service";
import cookieParser from "cookie-parser";
import path from "node:path";
dbConnection().catch(() => process.exit(1))
const app = express();
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
})); app.use(cookieParser())
app.use(express.json());
app.use("/api", mainRouter)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serever is running on ${PORT}`))