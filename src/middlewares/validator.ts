import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const handleExpressValidation: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid Query", errors: errors.array() });
    return;
  }

  next();
};
