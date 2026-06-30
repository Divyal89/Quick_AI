import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookiesParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

app.use(express.json());
app.use(cookiesParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// using all the routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;
