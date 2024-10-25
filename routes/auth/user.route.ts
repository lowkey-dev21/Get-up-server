import express, { Express } from "express";
import { createUser, loginUser } from "../../controllers/auth/user.controller";
import { Request, Response, NextFunction } from "express";

// A wrapper to catch async errors
const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const router = express.Router();

router.post("/sign-up", asyncHandler(createUser));
router.post("/login", asyncHandler(loginUser));

export default router;
