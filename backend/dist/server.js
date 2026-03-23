"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const main_routes_1 = require("./routers/main.routes");
const db_service_1 = require("./services/db.service");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_path_1 = __importDefault(require("node:path"));
(0, db_service_1.dbConnection)().catch(() => process.exit(1));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api", main_routes_1.mainRouter);
app.use("/uploads", express_1.default.static(node_path_1.default.join(process.cwd(), "uploads")));
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serever is running on ${PORT}`));
