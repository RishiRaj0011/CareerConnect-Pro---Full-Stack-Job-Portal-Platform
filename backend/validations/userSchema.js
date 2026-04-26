import { z } from "zod";
import { USER_ROLE } from "../utils/constants.js";

const roleValues = Object.values(USER_ROLE);

export const registerSchema = z.object({
    fullname: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Invalid email format").toLowerCase(),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain one uppercase letter")
        .regex(/[0-9]/, "Must contain one number")
        .regex(/[^a-zA-Z0-9]/, "Must contain one special character"),
    role: z.enum(roleValues, {
        error: () => ({ message: `Role must be one of: ${roleValues.join(", ")}` }),
    }),
}).strict();

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(roleValues, {
        error: () => ({ message: `Role must be one of: ${roleValues.join(", ")}` }),
    }),
}).strict();

export const updateProfileSchema = z.object({
    fullname:    z.string().trim().min(2, "Name must be at least 2 characters").optional(),
    email:       z.string().trim().email("Invalid email format").toLowerCase().optional(),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits").optional(),
    bio:         z.string().max(300, "Bio must be under 300 characters").optional(),
    skills:      z.string().optional(),
}).strict();
