import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { AppError, asyncHandler } from "../utils/appError.js";

export const registerCompany = asyncHandler(async (req, res) => {
    const { companyName } = req.body;

    const existing = await Company.findOne({ name: companyName });
    if (existing) throw new AppError("A company with this name is already registered.", 409);

    const company = await Company.create({ name: companyName, userId: req.id });

    return res.status(201).json({ message: "Company registered successfully.", company, success: true });
});

export const getCompany = asyncHandler(async (req, res) => {
    const companies = await Company.find({ userId: req.id })
        .select("name logo location description website")
        .lean();
    return res.status(200).json({ companies, success: true });
});

export const getCompanyById = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id).lean();
    if (!company) throw new AppError("Company not found.", 404);
    return res.status(200).json({ company, success: true });
});

export const updateCompany = asyncHandler(async (req, res) => {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };

    // Logo upload is optional — only process if a file was sent
    if (req.file) {
        const fileUri = getDataUri(req.file);
        let cloudResponse;
        try {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                transformation: [{ quality: "auto", fetch_format: "auto" }],
                folder: "company_logos",
            });
        } catch {
            throw new AppError("Logo upload failed. Please try again.", 502);
        }
        updateData.logo = cloudResponse.secure_url;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!company) throw new AppError("Company not found.", 404);

    return res.status(200).json({ message: "Company information updated.", success: true });
});
