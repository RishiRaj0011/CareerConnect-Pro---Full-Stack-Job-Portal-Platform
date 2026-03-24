import mongoose from "mongoose";
import { USER_ROLE } from "../utils/constants.js";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        required: true,
    },
    profile: {
        bio:               { type: String },
        skills:            [{ type: String }],
        resume:            { type: String },
        resumeOriginalName:{ type: String },
        company:           { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        profilePhoto:      { type: String, default: "" },
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
