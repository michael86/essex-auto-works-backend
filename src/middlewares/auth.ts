import { handleExpressValidation } from "./validator";
import { loginValidation, registrationValidation } from "../validators/auth/authValidation";

export const validateRegistration = [...registrationValidation, handleExpressValidation];
export const validateLogin = [...loginValidation, handleExpressValidation];
