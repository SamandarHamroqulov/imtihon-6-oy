"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_MY_PROFILE = GET_MY_PROFILE;
exports.UPDATE_MY_PROFILE = UPDATE_MY_PROFILE;
exports.GET_USER_PROFILE = GET_USER_PROFILE;
const Profile_model_1 = require("../models/User/Profile.model");
const User_model_1 = require("../models/User/User.model");
async function GET_MY_PROFILE(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const profile = await Profile_model_1.ProfileModel.findOne({
            where: { userId },
            include: [
                {
                    model: User_model_1.UserModel,
                    attributes: ["email", "role"],
                },
            ],
        });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json({ profile });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "GET_MY_PROFILE"
        });
    }
}
async function UPDATE_MY_PROFILE(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { firstname, lastname } = req.body;
        const profile = await Profile_model_1.ProfileModel.findOne({ where: { userId } });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        const updateData = {};
        if (firstname)
            updateData.firstname = firstname;
        if (lastname)
            updateData.lastname = lastname;
        if (req.file)
            updateData.avatar = req.file.path.replace(/\\/g, "/");
        await profile.update(updateData);
        return res.status(200).json({
            message: "Profile updated successfully",
            data: profile,
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "UPDATE_MY_PROFILE"
        });
    }
}
async function GET_USER_PROFILE(req, res) {
    try {
        const { userId } = req.params;
        if (!userId || Number.isNaN(Number(userId))) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const profile = await Profile_model_1.ProfileModel.findOne({
            where: { userId: Number(userId) },
            include: [
                {
                    model: User_model_1.UserModel,
                    attributes: ["email", "role"],
                },
            ],
        });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json({ profile });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "GET_USER_PROFILE"
        });
    }
}
