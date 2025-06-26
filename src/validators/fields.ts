import { body } from "express-validator";

export const emailField = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Invalid email address");

export const passwordField = body("password")
  .notEmpty()
  .withMessage("Password is required");

export const strongPasswordField = body("password")
  .trim()
  .isStrongPassword()
  .withMessage(
    "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
  );

export const firstNameField = body("firstname")
  .trim()
  .notEmpty()
  .withMessage("Firstname must be provided")
  .not()
  .matches(/\d/)
  .withMessage("Firstname cannot contain a number");

export const lastNameField = body("lastname")
  .trim()
  .notEmpty()
  .withMessage("Lastname must be provided")
  .not()
  .matches(/\d/)
  .withMessage("Lastname cannot contain a number");
