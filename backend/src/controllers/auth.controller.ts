import { Request, Response } from "express";
import {
  forgotPassValidator,
  loginValidator,
  registerValidator,
  resendOtpValidator,
  resetPasswordValidator,
  verifyUserValidator,
} from "../helpers/validators/auth.validator";
import { UserModel } from "../models/User/User.model";
import { BookshelfModel } from "../models/Bookshelf/Bookshelf.Model";
import { compare, hash } from "bcrypt";
import { otpGenerator } from "../helpers/generators/otp.generator";
import { emailService } from "../services/mail.service";
import { jwtService } from "../services/jwt.service";
import { ProfileModel } from "../models/User/Profile.model";

export async function REGISTER(req: Request, res: Response) {
  try {
    const data = req.body;

    await registerValidator.validateAsync(data);
    if (req.file) {
      data.image = req.file.path.replace(/\\/g, "/");
    }
    const checkUser = await UserModel.findOne({
      where: { email: data.email },
    });

    if (checkUser) {
      return res.status(400).json({
        message: "User already exist with this email",
      });
    }

    const hashPassword = await hash(data.password, 10);
    const { otp, otpExpires } = otpGenerator();
    await emailService(data.email, otp);

    const newUser = await UserModel.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashPassword,
      otp,
      otpExpires,
      role: "user" 
    });
    await ProfileModel.create({
      userId: newUser.dataValues.id,
      firstname: data.firstname,
      lastname: data.lastname,
      avatar: data.image
    })

    await BookshelfModel.create({
      userId: newUser.dataValues.id,
      name: `${data.firstName || "My"}'s Bookshelf`,
    });

    return res.status(201).json({
      message: "User created and bookshelf opened",
    });
  } catch (err: any) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message,
      controller: "REGISTER"
    });
  }
}

export async function RESEND_OTP(req: Request, res: Response) {
  try {
    const { email } = req.body;

    await resendOtpValidator.validateAsync({ email });

    const findUser = await UserModel.findOne({ where: { email } });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (findUser.dataValues.is_verified) {
      return res.status(400).json({ message: "User already registered" });
    }

    const { otp, otpExpires } = otpGenerator();
    await emailService(findUser.dataValues.email, otp);

    await UserModel.update({ otp, otpExpires }, { where: { email } });

    return res.status(200).json({
      message: "Verification code successfully resent to your email",
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "RESEND_OTP ERROR", err: err.message });
  }
}

export async function VERIFY_USER(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.email || !data.otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    await verifyUserValidator.validateAsync(req.body);

    const findUser = await UserModel.findOne({ where: { email: data.email } });

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
  } catch (err: any) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "VERIFY_USER"
    });
  }
}

export async function LOGIN(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    await loginValidator.validateAsync(req.body);

    const findUser = await UserModel.findOne({ where: { email } });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!findUser.dataValues.is_verified) {
      return res.status(403).json({ message: "Verify your email first" });
    }

    const checkPassword = await compare(password, findUser.dataValues.password);
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

    const accessToken = jwtService.createAccessToken(payload);
    const refreshToken = jwtService.createRefreshToken(payload);

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

    const profile = await ProfileModel.findOne({ where: { userId: user.id } });
    const userData = { ...user, avatar: profile?.dataValues.avatar };

    return res
      .status(200)
      .json({ message: "User successfully logged in", accessToken, user: userData });
  } catch (err: any) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "LOGIN"
    });
  }
}

export async function FORGOT_PASSWORD(req: Request, res: Response) {
  try {
    const { email } = req.body;

    await forgotPassValidator.validateAsync(req.body);

    const findUser = await UserModel.findOne({ where: { email } });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!findUser.dataValues.is_verified) {
      return res.status(400).json({ message: "User is not verified" });
    }

    const { otp, otpExpires } = otpGenerator();
    await emailService(email, otp);

    await findUser.update({ otp, otpExpires });

    return res
      .status(200)
      .json({ message: "Verification code sent to your email" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "FORGOT_PASSWORD ERROR", err: err.message });
  }
}

export async function RESET_PASSWORD(req: Request, res: Response) {
  try {
    const data = req.body;

    await resetPasswordValidator.validateAsync(req.body);

    const findUser = await UserModel.findOne({ where: { email: data.email } });

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

    const hashedPassword = await hash(data.newPassword, 10);

    await findUser.update({
      otp: null,
      otpExpires: null,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.log(err);
    
    return res
      .status(500)
      .json({ message: "RESET_PASSWORD ERROR", err: err.message });
  }
}

export async function CHANGE_PASSWORD(req: Request, res: Response) {
  try {
    const { password, newPassword } = req.body;
    const userId = (req as any).user.id;

    const findUser = await UserModel.findByPk(userId);

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!findUser.dataValues.is_verified) {
      return res.status(400).json({ message: "Verify your email first" });
    }

    const checkPassword = await compare(password, findUser.dataValues.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const isSameAsOld = await compare(
      newPassword,
      findUser.dataValues.password,
    );
    if (isSameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different from the old one" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await findUser.update({ password: hashedPassword });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "CHANGE_PASSWORD ERROR", err: err.message });
  }
}

export async function REFRESH(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Token not found" });
    }

    const payload = jwtService.parseRefreshToken(refreshToken);
    if (!payload || !payload.id) {
       return res.status(401).json({ message: "Invalid token payload" });
    }

    const findUser = await UserModel.findByPk(payload.id);
    if (!findUser) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = jwtService.createAccessToken({
      id: payload.id,
      role: payload.role,
      email: payload.email,
    });

    return res
      .status(200)
      .json({ message: "Access token generated", accessToken });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "REFRESH"
    });
  }
}
