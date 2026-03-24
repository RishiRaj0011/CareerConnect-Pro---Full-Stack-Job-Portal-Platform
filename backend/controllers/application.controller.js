import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { AppError, asyncHandler } from "../utils/appError.js";
import { APPLICATION_STATUS } from "../utils/constants.js";

// Reusable populate projection — only fetch fields the UI actually renders
const APPLICANT_PROJECTION = "fullname email phoneNumber profile.resume profile.resumeOriginalName createdAt";
const COMPANY_PROJECTION   = "name logo location";
const JOB_PROJECTION       = "title location jobType salary company";

export const applyJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;
    const userId = req.id;

    const job = await Job.findById(jobId).select("_id applications");
    if (!job) throw new AppError("Job not found.", 404);

    // Atomic insert — the compound unique index { job, applicant } on the
    // Application collection rejects duplicates at the DB level with code 11000,
    // which the global error handler maps to a 409 response automatically.
    const newApplication = await Application.create({ job: jobId, applicant: userId });

    // $push is atomic — no race condition vs. a find-then-save pattern
    await Job.findByIdAndUpdate(jobId, { $push: { applications: newApplication._id } });

    return res.status(201).json({ message: "Job applied successfully.", success: true });
});

export const getAppliedJobs = asyncHandler(async (req, res) => {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [applications, total] = await Promise.all([
        Application.find({ applicant: req.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path:   "job",
                select: JOB_PROJECTION,
                populate: { path: "company", select: COMPANY_PROJECTION },
            }),
        Application.countDocuments({ applicant: req.id }),
    ]);

    return res.status(200).json({
        success: true,
        applications,
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

export const getApplicants = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId).select("title _id").lean();
    if (!job) throw new AppError("Job not found.", 404);

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [applications, total] = await Promise.all([
        Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: "applicant", select: APPLICANT_PROJECTION }),
        Application.countDocuments({ job: jobId }),
    ]);

    return res.status(200).json({
        success: true,
        job,
        applications,
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

export const updateStatus = asyncHandler(async (req, res) => {
    const status = req.body.status.toLowerCase();

    // findOneAndUpdate is atomic — no race condition between find and save
    const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );
    if (!application) throw new AppError("Application not found.", 404);

    return res.status(200).json({ message: "Status updated successfully.", success: true });
});
