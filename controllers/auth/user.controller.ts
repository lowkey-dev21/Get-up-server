import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../../models/user.model";
import jwt from "jsonwebtoken";

// Utility function to validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate password
const isValidPassword = (password: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Create user controller with manual validation
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Manual input validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      msg: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  try {
    // Check if email already exists
    const emailExisted = await User.findOne({ email });
    if (emailExisted) {
      return res.status(409).json({ msg: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({ msg: "Failed to create user" });
    }

    const accessToken = jwt.sign(
      { _id: user?._id, name: user?.name },
      process.env.SECRET_KEY,
      { expiresIn: "7 days" }
    );

    // Send response
    res.status(201).json({
      msg: "Sign Up successful",
      user: { ...user.toObject(), password: undefined, token: accessToken }, // Exclude password from the response
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;

    if (!email || !password) {
      return res.status(401).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ msg: "User does not exist" });
    }

    // Compare passwords
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    if (!correctPassword) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    if (!correctPassword) {
      return res.status(401).json({ msg: " Incorrect Password" });
    }

    const accessToken = jwt.sign(
      { _id: user?.id, name: user?.name, email: user?.email },
      process.env.SECRET_KEY,
      { expiresIn: "7 days" }
    );

    res.status(201).json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ msg: "Error occured," + error });
  }
};
