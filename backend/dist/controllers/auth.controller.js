"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTER = REGISTER;
exports.RESEND_OTP = RESEND_OTP;
exports.VERIFY_USER = VERIFY_USER;
exports.LOGIN = LOGIN;
exports.FORGOT_PASSWORD = FORGOT_PASSWORD;
exports.RESET_PASSWORD = RESET_PASSWORD;
exports.CHANGE_PASSWORD = CHANGE_PASSWORD;
exports.REFRESH = REFRESH;
const auth_validator_1 = require("../helpers/validators/auth.validator");
const User_model_1 = require("../models/User/User.model");
const Bookshelf_Model_1 = require("../models/Bookshelf/Bookshelf.Model");
const bcrypt_1 = require("bcrypt");
const otp_generator_1 = require("../helpers/generators/otp.generator");
const mail_service_1 = require("../services/mail.service");
const jwt_service_1 = require("../services/jwt.service");
const Profile_model_1 = require("../models/User/Profile.model");
async function REGISTER(req, res) {
    try {
        const data = req.body;
        await auth_validator_1.registerValidator.validateAsync(data);
        if (req.file) {
            data.image = req.file.path.replace(/\\/g, "/");
        }
        const checkUser = await User_model_1.UserModel.findOne({
            where: { email: data.email },
        });
        if (checkUser) {
            return res.status(400).json({
                message: "User already exist with this email",
            });
        }
        const hashPassword = await (0, bcrypt_1.hash)(data.password, 10);
        const { otp, otpExpires } = (0, otp_generator_1.otpGenerator)();
        await (0, mail_service_1.emailService)(data.email, otp);
        const newUser = await User_model_1.UserModel.create({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: hashPassword,
            otp,
            otpExpires,
            role: "user"
        });
        await Profile_model_1.ProfileModel.create({
            userId: newUser.dataValues.id,
            firstname: data.firstname,
            lastname: data.lastname,
            avatar: data.image
        });
        await Bookshelf_Model_1.BookshelfModel.create({
            userId: newUser.dataValues.id,
            name: `${data.firstName || "My"}'s Bookshelf`,
        });
        return res.status(201).json({
            message: "User created and bookshelf opened",
        });
    }
    catch (err) {
        if (err.isJoi)
            return res.status(400).json({ message: err.message });
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "REGISTER"
        });
    }
}
async function RESEND_OTP(req, res) {
    try {
        const { email } = req.body;
        await auth_validator_1.resendOtpValidator.validateAsync({ email });
        const findUser = await User_model_1.UserModel.findOne({ where: { email } });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (findUser.dataValues.is_verified) {
            return res.status(400).json({ message: "User already registered" });
        }
        const { otp, otpExpires } = (0, otp_generator_1.otpGenerator)();
        await (0, mail_service_1.emailService)(findUser.dataValues.email, otp);
        await User_model_1.UserModel.update({ otp, otpExpires }, { where: { email } });
        return res.status(200).json({
            message: "Verification code successfully resent to your email",
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "RESEND_OTP ERROR", err: err.message });
    }
}
async function VERIFY_USER(req, res) {
    try {
        const data = req.body;
        if (!data.email || !data.otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        await auth_validator_1.verifyUserValidator.validateAsync(req.body);
        const findUser = await User_model_1.UserModel.findOne({ where: { email: data.email } });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (findUser.dataValues.is_verified) {
            return res.status(400).json({ message: "User already verified" });
        }
        if (findUser.dataValues.otp !== Number(data.otp)) {
            return res
                .status(400)
                .json({ message: "Verification code is incorrect" });
        }
        const currentDate = Date.now();
        if (findUser.dataValues.otpExpires < currentDate) {
            return res.status(400).json({ message: "Verification code is expired" });
        }
        await findUser.update({
            is_verified: true,
            otp: null,
            otpExpires: null,
        });
        return res.status(200).json({ message: "User successfully verified" });
    }
    catch (err) {
        if (err.isJoi)
            return res.status(400).json({ message: err.message });
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "VERIFY_USER"
        });
    }
}
async function LOGIN(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        await auth_validator_1.loginValidator.validateAsync(req.body);
        const findUser = await User_model_1.UserModel.findOne({ where: { email } });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!findUser.dataValues.is_verified) {
            return res.status(403).json({ message: "Verify your email first" });
        }
        const checkPassword = await (0, bcrypt_1.compare)(password, findUser.dataValues.password);
        if (!checkPassword) {
            return res
                .status(401)
                .json({ message: "Email or password is incorrect" });
        }
        const payload = {
            email: findUser.dataValues.email,
            id: findUser.dataValues.id,
            role: findUser.dataValues.role,
        };
        const accessToken = jwt_service_1.jwtService.createAccessToken(payload);
        const refreshToken = jwt_service_1.jwtService.createRefreshToken(payload);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const user = {
            id: findUser.dataValues.id,
            email: findUser.dataValues.email,
            role: findUser.dataValues.role,
            firstname: findUser.dataValues.firstname,
            lastname: findUser.dataValues.lastname,
        };
        const profile = await Profile_model_1.ProfileModel.findOne({ where: { userId: user.id } });
        const userData = { ...user, avatar: profile?.dataValues.avatar };
        return res
            .status(200)
            .json({ message: "User successfully logged in", accessToken, user: userData });
    }
    catch (err) {
        if (err.isJoi)
            return res.status(400).json({ message: err.message });
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "LOGIN"
        });
    }
}
async function FORGOT_PASSWORD(req, res) {
    try {
        const { email } = req.body;
        await auth_validator_1.forgotPassValidator.validateAsync(req.body);
        const findUser = await User_model_1.UserModel.findOne({ where: { email } });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!findUser.dataValues.is_verified) {
            return res.status(400).json({ message: "User is not verified" });
        }
        const { otp, otpExpires } = (0, otp_generator_1.otpGenerator)();
        await (0, mail_service_1.emailService)(email, otp);
        await findUser.update({ otp, otpExpires });
        return res
            .status(200)
            .json({ message: "Verification code sent to your email" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "FORGOT_PASSWORD ERROR", err: err.message });
    }
}
async function RESET_PASSWORD(req, res) {
    try {
        const data = req.body;
        await auth_validator_1.resetPasswordValidator.validateAsync(req.body);
        const findUser = await User_model_1.UserModel.findOne({ where: { email: data.email } });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (Number(findUser.dataValues.otp) !== Number(data.otp)) {
            return res
                .status(400)
                .json({ message: "Verification code is incorrect" });
        }
        const currentDate = Date.now();
        if (findUser.dataValues.otpExpires < currentDate) {
            return res.status(400).json({ message: "Verification code is expired" });
        }
        const hashedPassword = await (0, bcrypt_1.hash)(data.newPassword, 10);
        await findUser.update({
            otp: null,
            otpExpires: null,
            password: hashedPassword,
        });
        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "RESET_PASSWORD ERROR", err: err.message });
    }
}
async function CHANGE_PASSWORD(req, res) {
    try {
        const { password, newPassword } = req.body;
        const userId = req.user.id;
        const findUser = await User_model_1.UserModel.findByPk(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!findUser.dataValues.is_verified) {
            return res.status(400).json({ message: "Verify your email first" });
        }
        const checkPassword = await (0, bcrypt_1.compare)(password, findUser.dataValues.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }
        const isSameAsOld = await (0, bcrypt_1.compare)(newPassword, findUser.dataValues.password);
        if (isSameAsOld) {
            return res
                .status(400)
                .json({ message: "New password must be different from the old one" });
        }
        const hashedPassword = await (0, bcrypt_1.hash)(newPassword, 10);
        await findUser.update({ password: hashedPassword });
        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "CHANGE_PASSWORD ERROR", err: err.message });
    }
}
async function REFRESH(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Token not found" });
        }
        const payload = jwt_service_1.jwtService.parseRefreshToken(refreshToken);
        if (!payload || !payload.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        const findUser = await User_model_1.UserModel.findByPk(payload.id);
        if (!findUser) {
            return res.status(401).json({ message: "User not found" });
        }
        const accessToken = jwt_service_1.jwtService.createAccessToken({
            id: payload.id,
            role: payload.role,
            email: payload.email,
        });
        return res
            .status(200)
            .json({ message: "Access token generated", accessToken });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "REFRESH"
        });
    }
}
