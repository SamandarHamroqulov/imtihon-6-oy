"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poetRouter = void 0;
const express_1 = require("express");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const poet_controller_1 = require("../controllers/poet.controller");
const upload_service_1 = require("../services/upload.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.poetRouter = (0, express_1.Router)();
exports.poetRouter.post("/create", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, (0, upload_service_1.uploadFile)("poets").single("image"), poet_controller_1.CREATE_POET);
exports.poetRouter.get("/all", auth_middleware_1.authMiddleware, poet_controller_1.GET_POETS);
exports.poetRouter.route("/:id")
    .get(auth_middleware_1.authMiddleware, poet_controller_1.GET_POET)
    .put(auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, poet_controller_1.UPDATE_POET)
    .delete(auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, poet_controller_1.DELETE_POET);
