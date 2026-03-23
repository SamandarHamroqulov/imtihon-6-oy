import multer from "multer";
import path from "path";
import fs from "fs";

export const uploadFile = (folderName: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const path = `uploads/${folderName}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Faqat rasm yuklash mumkin!"), false);
    }
  };

  return multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });
};