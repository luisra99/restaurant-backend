import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  "/public/users",
  express.static(path.join(__dirname, "/uploads/users"))
);
app.use(
  "/public/courses",
  express.static(path.join(__dirname, "/uploads/courses"))
);
app.use(
  "/public/certificates",
  express.static(path.join(__dirname, "/uploads/certificates"))
);

export default app;
