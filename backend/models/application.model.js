import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../utils/constants.js";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(APPLICATION_STATUS),
        default: APPLICATION_STATUS.PENDING,
    },
}, { timestamps: true });

// Compound unique index: one application per user per job — enforced at DB level
// Also serves as an index for the duplicate-check query { job, applicant }
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Index for getAppliedJobs query: find all applications by a user, sorted by date
applicationSchema.index({ applicant: 1, createdAt: -1 });

export const Application = mongoose.model("Application", applicationSchema);
