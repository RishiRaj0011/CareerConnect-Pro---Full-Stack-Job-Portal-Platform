import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../utils/env.js";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title:       "CareerConnect Pro API",
            version:     "1.0.0",
            description: "REST API for CareerConnect Pro — a full-stack job portal for students and recruiters.",
            contact:     { name: "API Support", email: "support@careerconnect.pro" },
        },
        servers: [
            {
                url:         env.NODE_ENV === "production"
                                 ? `${env.FRONTEND_URL}/api/v1`
                                 : `http://localhost:${env.PORT}/api/v1`,
                description: env.NODE_ENV === "production" ? "Production" : "Development",
            },
        ],
        // Cookie-based auth — token is set via httpOnly cookie on login
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in:   "cookie",
                    name: "token",
                },
            },
            schemas: {
                // ── Reusable response schemas ──────────────────────────────
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string",  example: "Operation successful." },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string",  example: "Something went wrong." },
                    },
                },
                ValidationErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string",  example: "Validation Error" },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field:   { type: "string", example: "email" },
                                    message: { type: "string", example: "Invalid email format" },
                                },
                            },
                        },
                    },
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total:       { type: "integer", example: 100 },
                        page:        { type: "integer", example: 1 },
                        limit:       { type: "integer", example: 10 },
                        totalPages:  { type: "integer", example: 10 },
                        hasNextPage: { type: "boolean", example: true },
                        hasPrevPage: { type: "boolean", example: false },
                    },
                },
                // ── Domain schemas ─────────────────────────────────────────
                UserProfile: {
                    type: "object",
                    properties: {
                        bio:               { type: "string",  example: "Full-stack developer" },
                        skills:            { type: "array", items: { type: "string" }, example: ["React", "Node.js"] },
                        resume:            { type: "string",  example: "https://res.cloudinary.com/..." },
                        resumeOriginalName:{ type: "string",  example: "john_resume.pdf" },
                        profilePhoto:      { type: "string",  example: "https://res.cloudinary.com/..." },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        _id:         { type: "string",  example: "64f1a2b3c4d5e6f7a8b9c0d1" },
                        fullname:    { type: "string",  example: "John Doe" },
                        email:       { type: "string",  example: "john@example.com" },
                        phoneNumber: { type: "string",  example: "9876543210" },
                        role:        { type: "string",  enum: ["student", "recruiter"] },
                        profile:     { $ref: "#/components/schemas/UserProfile" },
                    },
                },
                Company: {
                    type: "object",
                    properties: {
                        _id:         { type: "string",  example: "64f1a2b3c4d5e6f7a8b9c0d2" },
                        name:        { type: "string",  example: "Acme Corp" },
                        description: { type: "string",  example: "A leading tech company" },
                        website:     { type: "string",  example: "https://acme.com" },
                        location:    { type: "string",  example: "Bangalore" },
                        logo:        { type: "string",  example: "https://res.cloudinary.com/..." },
                    },
                },
                Job: {
                    type: "object",
                    properties: {
                        _id:            { type: "string",  example: "64f1a2b3c4d5e6f7a8b9c0d3" },
                        title:          { type: "string",  example: "Senior React Developer" },
                        description:    { type: "string",  example: "Build scalable frontend apps" },
                        requirements:   { type: "array", items: { type: "string" }, example: ["React", "TypeScript"] },
                        salary:         { type: "number",  example: 1200000 },
                        location:       { type: "string",  example: "Remote" },
                        jobType:        { type: "string",  enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"] },
                        experienceLevel:{ type: "number",  example: 3 },
                        position:       { type: "number",  example: 2 },
                        company:        { $ref: "#/components/schemas/Company" },
                        createdAt:      { type: "string",  format: "date-time" },
                    },
                },
                Application: {
                    type: "object",
                    properties: {
                        _id:       { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d4" },
                        job:       { $ref: "#/components/schemas/Job" },
                        applicant: { $ref: "#/components/schemas/User" },
                        status:    { type: "string", enum: ["pending", "accepted", "rejected"], example: "pending" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
        // Apply cookie auth globally — individual endpoints can override
        security: [{ cookieAuth: [] }],
    },
    // Scan all route files for JSDoc @swagger annotations
    apis: ["./swagger/paths/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
