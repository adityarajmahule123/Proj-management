import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//basic configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

//cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "authorization"],
  })
);

//imporing routes

import healthCheckRouter from "./routes/healthcheck.route.js";
import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to basecampy");
});
// Global error handler - returns consistent JSON for ApiError and other errors
import { ApiError } from "./utils/api-error.js";
import { ApiResponse } from "./utils/api-response.js";

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  const errors = err?.errors || null;

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, errors, message));
});

export default app;
