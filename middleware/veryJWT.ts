import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  token: JwtPayload | string;
}

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Extract token if header is present

    if (!token) {
      res.status(401).json({ msg: "User is not authorized" });
      return; // Stop further execution in this branch
    }

    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new Error("Secret key is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    (req as CustomRequest).token = decoded;
    next(); // Pass control to the next middleware/handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "User is Unauthorized" });
  }
};
