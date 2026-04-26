import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Always resolve .env relative to THIS file's location (backend/utils/ → backend/)
// Works regardless of which directory `node` is invoked from
const envPath = path.resolve(__dirname, "../.env");
const result  = dotenv.config({ path: envPath });

if (result.error) {
    process.stderr.write(`\n[ENV] Warning: Could not load .env from ${envPath}\n`);
}

const envSchema = z.object({
    PORT:         z.string().default("8000"),
    NODE_ENV:     z.enum(["development", "production", "test"]).default("development"),
    MONGO_URI:    z.string().min(1, "MONGO_URI is required"),
    SECRET_KEY:   z.string().min(16, "SECRET_KEY must be at least 16 characters"),
    CLOUD_NAME:   z.string().min(1, "CLOUD_NAME is required"),
    API_KEY:      z.string().min(1, "API_KEY is required"),
    API_SECRET:   z.string().min(1, "API_SECRET is required"),
    FRONTEND_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const issues = parsed.error.issues
        .map((e) => `  ✗ ${e.path.join(".")}: ${e.message}`)
        .join("\n");
    process.stderr.write(
        `\n[ENV VALIDATION FAILED] Server cannot start. Fix the following:\n${issues}\n\n`
    );
    process.exit(1);
}

export const env = parsed.data;
