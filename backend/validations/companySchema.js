import { z } from "zod";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export const registerCompanySchema = z.object({
    companyName: z.string().min(1, "Company name is required").trim(),
}).strict();

export const updateCompanySchema = z.object({
    name:        z.string().min(1).trim().optional(),
    description: z.string().optional(),
    website:     z.string().url("Invalid website URL").optional().or(z.literal("")),
    location:    z.string().optional(),
    foundedYear: z.coerce.number().min(1800).max(new Date().getFullYear()).optional(),
    companySize: z.enum(COMPANY_SIZES).optional(),
}).strict();
