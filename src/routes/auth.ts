import { Router } from "express";
import {
  validateForgotPassword,
  validateLogin,
  validateRegistration,
  validateResendEmailVerification,
  validateResetPassword,
  validateResetToken,
} from "../middlewares/auth";
import {
  forgotPassword,
  loginUser,
  registerUser,
  resendEmailValidationToken,
  resetPassword,
  validateToken,
  validateUserJwt,
  verifyEmail,
} from "../controllers/auth";

const router = Router();

router.get("/me", validateUserJwt);
router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", validateResendEmailVerification, resendEmailValidationToken);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.get("/reset-password/validate/:token", validateResetToken, validateToken);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

export default router;
