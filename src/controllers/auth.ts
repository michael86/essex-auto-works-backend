import { randomBytes } from "crypto";
import { RequestHandler } from "express";
import {
  deleteVerificationToken,
  insertUser,
  selectUserByEmail,
  selectVerificationToken,
  setEmailVerified,
} from "../services/auth";
import bcrypt from "bcrypt";
import { generateAndSetJwtCookie } from "../utils/jwt";
import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { getTokenTimeRemaining } from "../utils";

const ROUNDS = 10;

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const hashedPass = await bcrypt.hash(password, ROUNDS);

    const token = randomBytes(32).toString("hex");
    await insertUser(firstname, lastname, email, hashedPass, token);

    await sendVerificationEmail(
      email,
      `${firstname} ${lastname}`,
      "Please verify your email",
      token
    );

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

    generateAndSetJwtCookie(res, user.id, "access");

    res.status(200).json({
      status: "success",
      message: "Login successful",
      code: "LOGIN_SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.params;

    const storedToken = await selectVerificationToken(token);

    if (getTokenTimeRemaining(new Date(storedToken.expiresAt)) <= 0) {
      res.status(401).json({
        status: 1,
        message: "Token has expired, please request a new one",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    await deleteVerificationToken(token);
    await setEmailVerified(storedToken.userId, 1);

    res.status(200).json({
      status: 1,
      message: "Email verified succesfully, you can now log in",
      code: "EMAIL_VERIFIED",
    });
  } catch (error) {
    next(error);
  }
};

export const resendEmailValidationToken: RequestHandler = (req, res, next) => {
  try {
    res
      .status(200)
      .json({
        status: "SUCCESS",
        code: "TOKEN_SENT",
        message: "Email sent, please check your inbox and spam folder.",
      });
  } catch (error) {
    next(error);
  }
};
