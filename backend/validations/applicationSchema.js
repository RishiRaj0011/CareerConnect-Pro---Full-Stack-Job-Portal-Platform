import { z } from "zod";
import { APPLICATION_STATUS } from "../utils/constants.js";

const statusValues = Object.values(APPLICATION_STATUS);

export const updateStatusSchema = z.object({
    status:        z.enum(statusValues, {
        error: () => ({ message: `Status must be one of: ${statusValues.join(", ")}` }),
    }),
    recruiterNote: z.string().max(500).optional(),
}).strict();
