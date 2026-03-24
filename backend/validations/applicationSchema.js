import { z } from "zod";
import { APPLICATION_STATUS } from "../utils/constants.js";

const statusValues = Object.values(APPLICATION_STATUS);

export const updateStatusSchema = z.object({
    status: z.enum(statusValues, {
        errorMap: () => ({ message: `Status must be one of: ${statusValues.join(", ")}` }),
    }),
}).strict();
