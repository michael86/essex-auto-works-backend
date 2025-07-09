import {
  emailField,
  passwordField,
  strongPasswordField,
  firstNameField,
  lastNameField,
  token,
} from "../fields";

export const registrationValidation = [
  emailField,
  strongPasswordField,
  firstNameField,
  lastNameField,
];

export const loginValidation = [emailField, passwordField];

export const resendEmailValidation = [emailField];

export const forgotPasswordValidation = [emailField];

export const resetPasswordValidation = [strongPasswordField];

export const validateResetPassToken = [token];
