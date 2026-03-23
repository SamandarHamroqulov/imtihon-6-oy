import { Router } from "express";
import { authRouter } from "./auth.routes";
import { poetRouter } from "./poet.routes";
import { bookRouter } from "./book.routes";
import { profileRouter } from "./profile.routes";
import { commentRouter } from "./comment.routes";

export const mainRouter = Router();
mainRouter.use("/auth", authRouter);
mainRouter.use("/poets", poetRouter);
mainRouter.use("/books", bookRouter)
mainRouter.use("/profile", profileRouter)
mainRouter.use("/comments", commentRouter);