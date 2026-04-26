import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { AppError, asyncHandler } from "../utils/appError.js";
import { APPLICATION_STATUS } from "../utils/constants.js";
import { sendApplicationConfirmEmail, sendStatusUpdateEmail } from "../utils/emailService.js";

const APPLICANT_PROJECTION = "fullname email phoneNumber profile.resume profile.resumeOriginalName createdAt";
const COMPANY_PROJECTION   = "name logo location";
const JOB_PROJECTION       = "title location jobType salary company";

export const applyJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;
    const userId = req.id;

    const [job, user] = await Promise.all([
        Job.findById(jobId).select("_id applications title company").populate("company", "name"),
        User.findById(userId).select("fullname email"),
    ]);
    if (!job) throw new AppError("Job not found.", 404);

    const newApplication = await Application.create({ job: jobId, applicant: userId });
    await Job.findByIdAndUpdate(jobId, { $push: { applications: newApplication._id } });

    // Non-blocking email
    sendApplicationConfirmEmail(user.email, user.fullname, job.title, job.company?.name ?? "the company");

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
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPrevPage: page > 1 },
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
        success: true, job, applications,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPrevPage: page > 1 },
    });
});

export const updateStatus = asyncHandler(async (req, res) => {
    const status = req.body.status.toLowerCase();

    const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    ).populate("applicant", "fullname email").populate({ path: "job", select: "title" });

    if (!application) throw new AppError("Application not found.", 404);

    // Non-blocking status update email
    sendStatusUpdateEmail(
        application.applicant.email,
        application.applicant.fullname,
        application.job.title,
        status
    );

    return res.status(200).json({ message: "Status updated successfully.", success: true });
});

// Admin dashboard — applications grouped by date for chart
export const getApplicationStats = asyncHandler(async (req, res) => {
    const stats = await Application.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }, // last 30 data points
    ]);

    const statusBreakdown = await Application.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({ success: true, stats, statusBreakdown });
});
