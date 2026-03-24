import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { AppError, asyncHandler } from "../utils/appError.js";

export const register = asyncHandler(async (req, res) => {
    const { fullname, email, phoneNumber, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("User already exists with this email.", 409);

    const file = req.file;
    if (!file) throw new AppError("Profile photo is required.", 400);

    const fileUri = getDataUri(file);
    let cloudResponse;
    try {
        cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            transformation: [{ quality: "auto", fetch_format: "auto" }],
            folder: "profile_photos",
        });
    } catch {
        throw new AppError("Image upload failed. Please try again.", 502);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
        profile: { profilePhoto: cloudResponse.secure_url },
    });

    return res.status(201).json({
        message: "Account created successfully.",
        success: true,
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    // +password explicitly re-includes the field excluded by select:false
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new AppError("Incorrect email or password.", 401);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new AppError("Incorrect email or password.", 401);

    if (role !== user.role)
        throw new AppError("Account doesn't exist with current role.", 403);

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    const safeUser = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
    };

    return res
        .status(200)
        .cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .json({ message: `Welcome back ${safeUser.fullname}`, user: safeUser, success: true });
});

export const logout = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .cookie("token", "", { maxAge: 0 })
        .json({ message: "Logged out successfully.", success: true });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    const user = await User.findById(req.id);
    if (!user) throw new AppError("User not found.", 404);

    if (file) {
        const fileUri = getDataUri(file);
        const uniqueFileName = `${req.id}_${Date.now()}_${file.originalname}`;
        let cloudResponse;
        try {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw",
                folder: "resumes",
                public_id: uniqueFileName,
                overwrite: false,
            });
        } catch {
            throw new AppError("Resume upload failed. Please try again.", 502);
        }
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",").map((s) => s.trim());

    await user.save();

    return res.status(200).json({
        message: "Profile updated successfully.",
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        },
        success: true,
    });
});
