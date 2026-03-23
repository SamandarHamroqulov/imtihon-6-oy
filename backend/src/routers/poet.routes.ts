import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { CREATE_POET, DELETE_POET, GET_POET, GET_POETS, UPDATE_POET } from "../controllers/poet.controller";
import { uploadFile } from "../services/upload.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export const poetRouter = Router();
poetRouter.post("/create",authMiddleware, adminMiddleware, uploadFile("poets").single("image"), CREATE_POET )
poetRouter.get("/all", authMiddleware,GET_POETS)
poetRouter.route("/:id")
.get(authMiddleware,GET_POET)
.put(authMiddleware,adminMiddleware, UPDATE_POET)
.delete(authMiddleware,adminMiddleware, DELETE_POET)    