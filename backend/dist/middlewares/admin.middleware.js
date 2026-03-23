"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = async (req, res, next) => {
    try {
        let user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbbidden request: only for admin" });
        }
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "Forbbidden request: only for admin" });
    }
};
exports.adminMiddleware = adminMiddleware;
