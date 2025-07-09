import { handleExpressValidation } from "./validator";
import {
  forgotPasswordValidation,
  loginValidation,
  registrationValidation,
  resendEmailValidation,
  resetPasswordValidation,
  validateResetPassToken,
} from "../validators/auth/authValidation";

export const validateRegistration = [...registrationValidation, handleExpressValidation];

export const validateLogin = [...loginValidation, handleExpressValidation];

export const validateResendEmailVerification = [...resendEmailValidation, handleExpressValidation];

export const validateForgotPassword = [...forgotPasswordValidation, handleExpressValidation];

export const validateResetPassword = [...resetPasswordValidation, handleExpressValidation];

export const validateResetToken = [...validateResetPassToken, handleExpressValidation];
