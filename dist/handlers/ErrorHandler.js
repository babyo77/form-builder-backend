"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.errorHandler = void 0;
const mongoose_1 = require("mongoose");
const errorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    console.log(err);
    if (err instanceof mongoose_1.MongooseError) {
        if (process.env.NODE_ENV === "production") {
            message = "An unexpected error occurred";
        }
        else {
            message = `MongoDB Error: ${err.message}`;
        }
    }
    else if (err.name === "TokenExpiredError") {
        message = "Your session has expired. Please log in again.";
        statusCode = 401;
    }
    else if (err.name === "JsonWebTokenError") {
        message = "Invalid credentials. Please log in again.";
        statusCode = 401;
    }
    res.status(statusCode).json({
        success: false,
        error: err.data,
        message,
    });
};
exports.errorHandler = errorHandler;
class ApiError extends Error {
    constructor(message = "Something went wrong", statusCode = 500, data = null) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
