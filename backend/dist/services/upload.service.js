"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const uploadFile = (folderName) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const path = `uploads/${folderName}`;
            if (!fs_1.default.existsSync(path)) {
                fs_1.default.mkdirSync(path, { recursive: true });
            }
            cb(null, path);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Faqat rasm yuklash mumkin!"), false);
        }
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    });
};
exports.uploadFile = uploadFile;
