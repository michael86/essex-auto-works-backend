import { handleExpressValidation } from "./validator";
import { registrationValidation } from "../validators/auth/registerValidator";

export const validateRegistration = [...registrationValidation, handleExpressValidation];
