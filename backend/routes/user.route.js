import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import validateRequest from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../validations/userSchema.js";

const router = express.Router();

router.route("/register").post(singleUpload, validateRequest(registerSchema), register);
router.route("/login").post(validateRequest(loginSchema), login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, validateRequest(updateProfileSchema), updateProfile);

export default router;
