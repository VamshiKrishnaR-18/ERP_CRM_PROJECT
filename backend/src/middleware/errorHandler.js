import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export function notFound(req, res, next) {
  next(new AppError(`Not Found ${req.originalUri}`, 404));
}

export function globalErrorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);

  const statusCode = err.statusCode || 500;

  const response = {
    status: err.status || "error",
    message: err.message || "Internal Server Error!",
  };

  if (env.nodeEnv !== "production" && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
