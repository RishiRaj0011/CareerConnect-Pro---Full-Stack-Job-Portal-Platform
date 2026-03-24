import mongoose from "mongoose";
import { JOB_TYPE } from "../utils/constants.js";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: [{ type: String }],
    salary: {
        type: Number,
        required: true,
    },
    experienceLevel: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        enum: Object.values(JOB_TYPE),
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
    }],
}, { timestamps: true });

// Compound text index: powers keyword search on title + description
// MongoDB uses this instead of a full collection scan
jobSchema.index({ title: "text", description: "text" });

// Index for location filter queries
jobSchema.index({ location: 1 });

// Index for getAdminJobs: find all jobs by a recruiter, sorted by date
jobSchema.index({ created_by: 1, createdAt: -1 });

// Index for populating jobs by company
jobSchema.index({ company: 1 });

export const Job = mongoose.model("Job", jobSchema);
