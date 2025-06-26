import { Router } from "express";
import {
  validateLogin,
  validateRegistration,
  validateResendEmailVerification,
} from "../middlewares/auth";
import {
  loginUser,
  registerUser,
  resendEmailValidationToken,
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
router.post("/forgot-password");
router.post("/reset-password");

export default router;
