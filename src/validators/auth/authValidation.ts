import {
  emailField,
  passwordField,
  strongPasswordField,
  firstNameField,
  lastNameField,
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

export const resetPasswordValidation = [passwordField];
