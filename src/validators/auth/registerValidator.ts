import { body } from "express-validator";

export const registrationValidation = [
  body("email").isEmail().normalizeEmail().withMessage("invalid email provided"),
  body("password")
    .trim()
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
    ),
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("firstname must be provided")
    .not()
    .matches(/\d/)
    .withMessage("firstname can not contain a number"),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("lastname must be provided")
    .not()
    .matches(/\d/)
    .withMessage("lastname can not contain a number"),
];
