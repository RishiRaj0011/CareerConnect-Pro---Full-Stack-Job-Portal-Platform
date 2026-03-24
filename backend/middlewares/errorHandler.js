import { AppError } from "../utils/appError.js";
import logger from "../utils/logger.js";

const handleCastError = (err) =>
    new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(`${field} already exists. Please use a different value.`, 409);
};

const handleValidationError = (err) => {
    const messages = Object.values(err.errors).map((e) => e.message);
    return new AppError(`Invalid input: ${messages.join(". ")}`, 400);
};

const handleJWTError = () =>
    new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
    new AppError("Your session has expired. Please log in again.", 401);

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    let error = err;

    if (err.name === "CastError") error = handleCastError(err);
    if (err.code === 11000) error = handleDuplicateKeyError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    // Operational errors: safe to expose message to client
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    // Programming/unknown errors: don't leak details
    logger.error("UNHANDLED ERROR", { message: err.message, stack: err.stack });
    return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
    });
};

export default globalErrorHandler;
