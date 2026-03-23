import { Router } from "express";
import {
  CHANGE_PASSWORD,
    FORGOT_PASSWORD,
  LOGIN,
  REFRESH,
  REGISTER,
  RESEND_OTP,
  RESET_PASSWORD,
  VERIFY_USER,
} from "../controllers/auth.controller";
import { uploadFile } from "../services/upload.service";

export const authRouter = Router();
authRouter.post("/register", uploadFile("avatars").single("image"), REGISTER);
authRouter.post("/verify/otp", VERIFY_USER);
authRouter.post("/resend/otp", RESEND_OTP);
authRouter.post("/login", LOGIN);
authRouter.post("/forgot/password", FORGOT_PASSWORD)
authRouter.post("/reset/password", RESET_PASSWORD);

authRouter.post("/change/password", CHANGE_PASSWORD);
authRouter.post("/refresh", REFRESH)
