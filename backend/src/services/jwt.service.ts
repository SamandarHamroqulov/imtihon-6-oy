import "dotenv/config";
import jwt, { sign, verify } from "jsonwebtoken";
const AccesTokenSecretKey = String(process.env.JWT_ACCESS_SECRET_KEY);
const RefreshTokenSecretKey = String(process.env.JWT_REFRSH_SECRET_KEY);
if (!AccesTokenSecretKey || !RefreshTokenSecretKey) {
  throw new Error("Secret key not found");
}

export const jwtService = {
  createAccessToken(payload: object) {
    return sign(payload, AccesTokenSecretKey, { expiresIn: "5m" });
  },
  parseAccessToken(token: string) {
    try {
      return verify(token, AccesTokenSecretKey);
    } catch (err: any) {
      return null;
    }
  },
  createRefreshToken(payload: object) {
    return sign(payload, RefreshTokenSecretKey, { expiresIn: "7d" });
  },
  parseRefreshToken(token: string) {
    try {
      return verify(token, RefreshTokenSecretKey) as any;
    } catch (err: any) {
      return null;
    }
  },
};
