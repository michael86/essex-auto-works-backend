import { handleExpressValidation } from "./validator";
import {
  loginValidation,
  registrationValidation,
  resendEmailValidation,
} from "../validators/auth/authValidation";

export const validateRegistration = [
  ...registrationValidation,
  handleExpressValidation,
];
export const validateLogin = [...loginValidation, handleExpressValidation];
export const validateResendEmailVerification = [
  ...resendEmailValidation,
  handleExpressValidation,
];
