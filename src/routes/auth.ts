import { Router } from "express";
import {
  validateForgotPassword,
  validateLogin,
  validateRegistration,
  validateResendEmailVerification,
  validateResetPassword,
} from "../middlewares/auth";
import {
  forgotPassword,
  loginUser,
  registerUser,
  resendEmailValidationToken,
  resetPassword,
  verifyEmail,
} from "../controllers/auth";

const router = Router();

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/resend-verification",
  validateResendEmailVerification,
  resendEmailValidationToken
);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

export default router;
