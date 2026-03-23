import { NextFunction, Request, Response } from "express";
import { jwtService } from "../services/jwt.service";
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let auth = req.headers.authorization;
    if (!auth) {
      throw new Error("Unauthorized");
    }
    let tokenType = auth.split(" ")[0];
    let accessToken = auth.split(" ")[1];
    if (!accessToken || tokenType != "Bearer")
      throw new Error("Token is invalid");
    const payload = jwtService.parseAccessToken(accessToken);
    (req as any).user = payload;
    next();
  } catch (err: any) {
    if (err.name == "TokenExpiredError")
      return res.status(401).json({ message: "AccessToken expired" });
    return res.status(401).json({ message: "Unauthorized" });
  } 
}
