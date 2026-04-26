// env.js loads .env and validates all vars before anything else runs
import "./utils/env.js";

import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import connectDB from "./utils/db.js";
import logger from "./utils/logger.js";
import requestLogger from "./middlewares/requestLogger.js";
import swaggerSpec from "./swagger/swaggerConfig.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import globalErrorHandler from "./middlewares/errorHandler.js";

connectDB();

const app      = express();
const PORT     = process.env.PORT || 8000;
const IS_PROD  = process.env.NODE_ENV === "production";
const _dirname = path.resolve();

// ── Security headers ───────────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow Cloudinary images
    // Relax CSP in dev so Swagger UI loads its inline scripts
    contentSecurityPolicy: IS_PROD ? undefined : false,
}));

// ── Rate limiting ──────────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts. Please try again after 15 minutes." },
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests from this IP. Please try again after 15 minutes." },
});

// ── Core middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(requestLogger); // Morgan → Winston

// ── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:5173"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Swagger UI (development only) ─────────────────────────────────────────
// Disabled in production — avoids exposing API internals publicly
if (!IS_PROD) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "CareerConnect Pro API Docs",
        swaggerOptions: {
            persistAuthorization: true, // keep cookie auth across page refreshes
        },
    }));
    logger.info(`Swagger UI available at http://localhost:${PORT}/api-docs`);
}

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/v1/user",        authLimiter, userRoute);
app.use("/api/v1/company",     apiLimiter,  companyRoute);
app.use("/api/v1/job",         apiLimiter,  jobRoute);
app.use("/api/v1/application", apiLimiter,  applicationRoute);

// ── Frontend static serving ────────────────────────────────────────────────
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// ── Global error handler (must be last) ───────────────────────────────────
app.use(globalErrorHandler);

app.listen(PORT, () => {
    logger.info(`Server running at port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
