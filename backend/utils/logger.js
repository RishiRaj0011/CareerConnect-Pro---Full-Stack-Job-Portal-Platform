import { createLogger, format, transports } from "winston";
import { env } from "./env.js";

const { combine, timestamp, printf, colorize, errors } = format;

// Human-readable format for development console
const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "HH:mm:ss" }),
    errors({ stack: true }),
    printf(({ level, message, timestamp, stack }) =>
        stack
            ? `${timestamp} [${level}] ${message}\n${stack}`
            : `${timestamp} [${level}] ${message}`
    )
);

// Structured JSON format for production files — easy to parse with log aggregators
const prodFormat = combine(
    timestamp(),
    errors({ stack: true }),
    format.json()
);

const logger = createLogger({
    level: env.NODE_ENV === "production" ? "warn" : "debug",
    format: env.NODE_ENV === "production" ? prodFormat : devFormat,
    transports: [
        new transports.Console(),
        // Production: write errors to error.log, everything to combined.log
        ...(env.NODE_ENV === "production"
            ? [
                new transports.File({ filename: "logs/error.log",    level: "error", maxsize: 5_242_880, maxFiles: 5 }),
                new transports.File({ filename: "logs/combined.log",               maxsize: 5_242_880, maxFiles: 5 }),
              ]
            : []),
    ],
    // Don't crash the process on unhandled logger errors
    exitOnError: false,
});

export default logger;
