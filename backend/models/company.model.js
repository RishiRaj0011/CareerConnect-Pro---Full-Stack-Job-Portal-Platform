import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:        { type: String, required: true, unique: true },
    description: { type: String },
    website:     { type: String },
    location:    { type: String },
    logo:        { type: String },
    foundedYear: { type: Number },
    companySize: { type: String, enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] },
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);
