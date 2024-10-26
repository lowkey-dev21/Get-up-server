import express, { Response, Request, NextFunction } from "express";
import {
  starter,
  saveCoach,
  welcome,
  setGender,
} from "../../controllers/home/starter/starter.controller";

const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const router = express.Router();

// starter
router.get("/starter", asyncHandler(starter));
router.post("/starter/coach", asyncHandler(saveCoach));
router.get("/starter/welcome", asyncHandler(welcome));
router.post("/starter/gender", asyncHandler(setGender));

export default router;
