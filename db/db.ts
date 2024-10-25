import mongoose from "mongoose";
import "dotenv/config";
const MONGO_URI: string | undefined = process.env.MONGO_DB;

export const mongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.error(`MongoDB connection Error ${error}`);
  }
};
