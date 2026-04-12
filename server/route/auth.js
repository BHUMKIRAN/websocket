import express from "express";
import authController from "../controller/auth.js";
import { expressAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Forgot password (send OTP/token)
router.post("/forgot-password", authController.forgotPassword);

// Reset password using token
router.post("/reset-password", authController.resetPassword);

// Update password (logged-in user)
router.put("/update-password", expressAuth, authController.UpdatePassword);

export default router;
