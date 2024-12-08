import { Response, NextFunction } from "express";
import { MongooseError } from "mongoose";
import { CustomRequest } from "../middleware/middleware";

export const errorHandler = (
  err: any,
  _req: CustomRequest,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  console.log(err);

  if (err instanceof MongooseError) {
    if (process.env.NODE_ENV === "production") {
      message = "An unexpected error occurred";
    } else {
      message = `MongoDB Error: ${err.message}`;
    }
  } else if (err.name === "TokenExpiredError") {
    message = "Your session has expired. Please log in again.";
    statusCode = 401;
  } else if (err.name === "JsonWebTokenError") {
    message = "Invalid credentials. Please log in again.";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    error: err.data,
    message,
  });
};

export class ApiError extends Error {
  statusCode: number;
  data: any;
  constructor(
    message: string = "Something went wrong",
    statusCode: number = 500,
    data: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
