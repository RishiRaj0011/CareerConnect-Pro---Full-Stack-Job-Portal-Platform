import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, getApplicationStats } from "../controllers/application.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import { updateStatusSchema } from "../validations/applicationSchema.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/stats").get(isAuthenticated, getApplicationStats);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, validateRequest(updateStatusSchema), updateStatus);

export default router;
