import { RequestHandler } from "express";
import { insertUser, selectUserByEmail } from "../services/auth";
import bcrypt from "bcrypt";

const ROUNDS = 10;

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const hashedPass = await bcrypt.hash(password, ROUNDS);

    await insertUser(firstname, lastname, email, hashedPass);

    //Add send email verication here

    res.status(201).json({
      status: "success",
      code: "REGISTERED",
      message: "Account created, Please verify your email.",
    });
  } catch (error: any) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await selectUserByEmail(email);

    if (!user.emailVerified) {
      res.status(403).json({
        status: "error",
        message: "Please verify your email to continue.",
        code: "EMAIL_NOT_VERIFIED",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        status: "error",
        message: "Invalid credentials.",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Login successful",
      code: "LOGIN_SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};
