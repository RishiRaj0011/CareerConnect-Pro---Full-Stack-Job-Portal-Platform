import { z } from "zod";

const envSchema = z.object({
    // Server
    PORT:         z.string().default("8000"),
    NODE_ENV:     z.enum(["development", "production", "test"]).default("development"),

    // Database
    MONGO_URI:    z.string().min(1, "MONGO_URI is required"),

    // Auth
    SECRET_KEY:   z.string().min(16, "SECRET_KEY must be at least 16 characters"),

    // Cloudinary
    CLOUD_NAME:   z.string().min(1, "CLOUD_NAME is required"),
    API_KEY:      z.string().min(1, "API_KEY is required"),
    API_SECRET:   z.string().min(1, "API_SECRET is required"),

    // Frontend (optional in dev — has fallback in index.js)
    FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL").optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const issues = parsed.error.errors
        .map((e) => `  ✗ ${e.path.join(".")}: ${e.message}`)
        .join("\n");

    // Use process.stderr directly — logger isn't initialized yet
    process.stderr.write(
        `\n[ENV VALIDATION FAILED] Server cannot start. Fix the following:\n${issues}\n\n`
    );
    process.exit(1);
}

export const env = parsed.data;
