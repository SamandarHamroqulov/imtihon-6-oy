"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
require("dotenv/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const AccesTokenSecretKey = String(process.env.JWT_ACCESS_SECRET_KEY);
const RefreshTokenSecretKey = String(process.env.JWT_REFRSH_SECRET_KEY);
if (!AccesTokenSecretKey || !RefreshTokenSecretKey) {
    throw new Error("Secret key not found");
}
exports.jwtService = {
    createAccessToken(payload) {
        return (0, jsonwebtoken_1.sign)(payload, AccesTokenSecretKey, { expiresIn: "5m" });
    },
    parseAccessToken(token) {
        try {
            return (0, jsonwebtoken_1.verify)(token, AccesTokenSecretKey);
        }
        catch (err) {
            return null;
        }
    },
    createRefreshToken(payload) {
        return (0, jsonwebtoken_1.sign)(payload, RefreshTokenSecretKey, { expiresIn: "7d" });
    },
    parseRefreshToken(token) {
        try {
            return (0, jsonwebtoken_1.verify)(token, RefreshTokenSecretKey);
        }
        catch (err) {
            return null;
        }
    },
};
