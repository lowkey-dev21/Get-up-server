import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { mongoDB } from "./db/db";
import userRoute from "./routes/auth/user.route";
import morgan from "morgan";

const PORT: string | undefined = process.env.PORT;
const app: Express = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

if (process.env.NODE_SERVER === "development") {
  app.use(morgan("dev"));
}

app.use("/auth", userRoute);

try {
  mongoDB();
  app.listen(PORT, () => {
    console.log("server is running on localhost:" + PORT);
  });
} catch (error) {
  console.error("server is encountering an error of:" + error);
}
