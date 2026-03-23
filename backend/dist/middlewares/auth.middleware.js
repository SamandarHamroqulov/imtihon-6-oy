"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_service_1 = require("../services/jwt.service");
async function authMiddleware(req, res, next) {
    try {
        let auth = req.headers.authorization;
        if (!auth) {
            throw new Error("Unauthorized");
        }
        let tokenType = auth.split(" ")[0];
        let accessToken = auth.split(" ")[1];
        if (!accessToken || tokenType != "Bearer")
            throw new Error("Token is invalid");
        const payload = jwt_service_1.jwtService.parseAccessToken(accessToken);
        req.user = payload;
        next();
    }
    catch (err) {
        if (err.name == "TokenExpiredError")
            return res.status(401).json({ message: "AccessToken expired" });
        return res.status(401).json({ message: "Unauthorized" });
    }
}
