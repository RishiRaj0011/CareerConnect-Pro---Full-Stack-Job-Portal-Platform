import jwt from "jsonwebtoken";
import { AppError, asyncHandler } from "../utils/appError.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) throw new AppError("You are not logged in. Please log in to continue.", 401);

    // jwt.verify throws JsonWebTokenError / TokenExpiredError — caught by globalErrorHandler
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userId;
    next();
});

export default isAuthenticated;
