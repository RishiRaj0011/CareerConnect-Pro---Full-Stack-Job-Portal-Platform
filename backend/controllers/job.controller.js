import { Job } from "../models/job.model.js";
import { AppError, asyncHandler } from "../utils/appError.js";

// Only fetch fields the UI renders — avoids over-fetching nested documents
const COMPANY_PROJECTION = "name logo location";

export const postJob = asyncHandler(async (req, res) => {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

    const job = await Job.create({
        title,
        description,
        requirements: requirements.split(",").map((r) => r.trim()),
        salary:        Number(salary),
        location,
        jobType,
        experienceLevel: experience,
        position,
        company:    companyId,
        created_by: req.id,
    });

    return res.status(201).json({ message: "New job created successfully.", job, success: true });
});

export const getAllJobs = asyncHandler(async (req, res) => {
    const { keyword, location, jobType, page: qPage, limit: qLimit } = req.query;

    const page  = Math.max(1, parseInt(qPage)  || 1);
    const limit = Math.min(50, parseInt(qLimit) || 10);
    const skip  = (page - 1) * limit;

    // Build filter — each clause only added when the param is present
    const filter = {};

    if (keyword) {
        // $text uses the compound text index { title: "text", description: "text" }
        // This is an index scan, not a full collection scan
        filter.$text = { $search: keyword };
    }
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType)  filter.jobType  = jobType;

    const [jobs, total] = await Promise.all([
        Job.find(filter)
            .populate("company", COMPANY_PROJECTION)
            .sort(keyword ? { score: { $meta: "textScore" } } : { createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Job.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        jobs,
        pagination: {
            total,
            page,
            limit,
            totalPages:  Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    });
});

export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
        .populate("company", COMPANY_PROJECTION)
        // Only fetch application count — not full application documents
        .populate("applications", "_id status")
        .lean();

    if (!job) throw new AppError("Job not found.", 404);
    return res.status(200).json({ job, success: true });
});

export const getAdminJobs = asyncHandler(async (req, res) => {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const filter = { created_by: req.id };

    const [jobs, total] = await Promise.all([
        Job.find(filter)
            .populate("company", COMPANY_PROJECTION)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Job.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        jobs,
        pagination: {
            total,
            page,
            limit,
            totalPages:  Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    });
});
