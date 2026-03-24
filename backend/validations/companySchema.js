import { z } from "zod";

export const registerCompanySchema = z.object({
    companyName: z.string().min(1, "Company name is required").trim(),
}).strict();

export const updateCompanySchema = z.object({
    name: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    website: z.string().url("Invalid website URL").optional(),
    location: z.string().optional(),
}).strict();
