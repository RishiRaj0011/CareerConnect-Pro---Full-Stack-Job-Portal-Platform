import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
import validateRequest from "../middlewares/validateRequest.js";
import { registerCompanySchema, updateCompanySchema } from "../validations/companySchema.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, validateRequest(registerCompanySchema), registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, validateRequest(updateCompanySchema), updateCompany);

export default router;
