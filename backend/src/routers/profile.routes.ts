import { Router } from "express";
import {
  GET_MY_PROFILE,
  UPDATE_MY_PROFILE,
  GET_USER_PROFILE,
} from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { uploadFile } from "../services/upload.service";

export const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get("/me", GET_MY_PROFILE);
profileRouter.put("/me", uploadFile("avatars").single("avatar"), UPDATE_MY_PROFILE);

profileRouter.get("/:userId", adminMiddleware, GET_USER_PROFILE);

