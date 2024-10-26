import { Request, Response } from "express";
import User from "../../../models/user.model";

interface CustomRequest extends Request {
  token?: {
    _id: string;
  };
}

export const starter = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.token._id;
    console.log(`userId: ${userId}`);
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User not found" });
    const starter = user.starter;
    await user.save();
    res.status(200).json({ starter: starter });
  } catch (error) {
    res.status(400).json({ msg: `Error: ${error}` });
    console.log(error);
  }
};

export const saveCoach = async (req: CustomRequest, res: Response) => {
  try {
    const { newCoach } = req.body;
    const userId = req.token._id;
    console.log(`User ID: ${userId}`);
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User not found" });
    user.coach = newCoach;
    await user.save();
    res.status(201).json({ coach: user.coach });
  } catch (error) {
    res.status(400).json({ msg: `Error: ${error}` });
    console.log(error);
  }
};

export const welcome = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.token._id;
    const user = await User.findOne({ _id: userId });
    console.log(`User ID: ${userId}`);
    const coach = user.coach;
    res.status(200).json({ coach: coach });
  } catch (error) {
    res.status(400).json({ msg: error });
    console.log(error);
  }
};
