import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  token: JwtPayload | string;
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization"?.split(" ")[1]);
    if (!token) {
      return res.status(401).json({ msg: "User is not authorized" });
    }

    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    (req as CustomRequest).token = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "User is Unauthorized" });
  }
};
