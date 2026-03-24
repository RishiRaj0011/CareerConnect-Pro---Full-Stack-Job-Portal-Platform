import morgan from "morgan";
import logger from "../utils/logger.js";
import { env } from "../utils/env.js";

// Pipe Morgan output into Winston so all logs go through one system
const stream = {
    write: (message) => logger.http(message.trim()),
};

// "dev" format in development (colored, concise), "combined" in production (Apache-style, full)
const requestLogger = morgan(
    env.NODE_ENV === "production" ? "combined" : "dev",
    { stream }
);

export default requestLogger;
