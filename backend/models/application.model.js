import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../utils/constants.js";

const statusHistorySchema = new mongoose.Schema({
    status:        { type: String, required: true },
    note:          { type: String, default: "" },
    changedAt:     { type: Date, default: Date.now },
}, { _id: false });

const applicationSchema = new mongoose.Schema({
    job:       { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type:    String,
        enum:    Object.values(APPLICATION_STATUS),
        default: APPLICATION_STATUS.PENDING,
    },
    recruiterNote:  { type: String, default: "" },
    statusHistory:  { type: [statusHistorySchema], default: [] },
}, { timestamps: true });

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, createdAt: -1 });

export const Application = mongoose.model("Application", applicationSchema);
