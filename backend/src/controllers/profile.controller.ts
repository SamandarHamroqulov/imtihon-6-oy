import { Request, Response } from "express";
import { ProfileModel } from "../models/User/Profile.model";
import { UserModel } from "../models/User/User.model";

export async function GET_MY_PROFILE(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await ProfileModel.findOne({
      where: { userId },
      include: [
        {
          model: UserModel,
          attributes: ["email", "role"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ profile });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "GET_MY_PROFILE"
    });
  }
}

export async function UPDATE_MY_PROFILE(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { firstname, lastname } = req.body;

    const profile = await ProfileModel.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updateData: any = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (req.file) updateData.avatar = req.file.path.replace(/\\/g, "/");

    await profile.update(updateData);

    return res.status(200).json({
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "UPDATE_MY_PROFILE"
    });
  }
}

export async function GET_USER_PROFILE(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    if (!userId || Number.isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const profile = await ProfileModel.findOne({
      where: { userId: Number(userId) },
      include: [
        {
          model: UserModel,
          attributes: ["email", "role"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ profile });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "GET_USER_PROFILE"
    });
  }
}