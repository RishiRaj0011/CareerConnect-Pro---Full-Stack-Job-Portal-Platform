import { z } from "zod";
import { JOB_TYPE } from "../utils/constants.js";

const jobTypeValues = Object.values(JOB_TYPE);

export const postJobSchema = z.object({
    title:       z.string().min(1, "Title is required").trim(),
    description: z.string().min(1, "Description is required").trim(),
    requirements:z.string().min(1, "Requirements are required"),
    salary:      z.coerce.number().positive("Salary must be a positive number"),
    location:    z.string().min(1, "Location is required").trim(),
    jobType: z.enum(jobTypeValues, {
        errorMap: () => ({ message: `Job type must be one of: ${jobTypeValues.join(", ")}` }),
    }),
    experience: z.coerce.number().min(0, "Experience level must be 0 or more"),
    position:   z.coerce.number().int().positive("Position count must be a positive integer"),
    companyId:  z.string().min(1, "Company ID is required"),
}).strict();
