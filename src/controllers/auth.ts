import { randomBytes } from "crypto";
import { RequestHandler } from "express";
import {
  deleteVerificationToken,
  deleteVerificationTokenByUserId,
  insertEmailVerifyToken,
  insertUser,
  selectUserByEmail,
  selectVerificationToken,
  setEmailVerified,
} from "../services/auth";
import bcrypt from "bcrypt";
import { generateAndSetJwtCookie } from "../utils/jwt";
import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { getTokenTimeRemaining, sleep } from "../utils";
import { sendResponse } from "../utils/sendResponse";

const ROUNDS = 10;

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    await sleep(500);
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

    sendResponse(res, 201, {
      status: "SUCCESS",
      code: "REGISTERED",
      message: "Account created, please verify your email",
    });
  } catch (error: any) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    await sleep(500);
    const { email, password } = req.body;
    const user = await selectUserByEmail(email);

    if (!user.emailVerified) {
      sendResponse(res, 403, {
        status: "ERROR",
        message: "Please verify your email to continue.",
        code: "EMAIL_NOT_VERIFIED",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await sleep(800);
      sendResponse(res, 401, {
        status: "ERROR",
        message: "Invalid credentials.",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    generateAndSetJwtCookie(res, user.id, "access");

    sendResponse(res, 200, {
      status: "SUCCESS",
      message: "Login successful",
      code: "LOGIN_SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
    await sleep(500);
    const { token } = req.params;

    const storedToken = await selectVerificationToken(token);

    if (getTokenTimeRemaining(new Date(storedToken.expiresAt)) <= 0) {
      sendResponse(res, 400, {
        status: "ERROR",
        message: "Token has expired, please request a new one",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    await deleteVerificationToken(token);
    await setEmailVerified(storedToken.userId, 1);

    sendResponse(res, 200, {
      status: "SUCCESS",
      message: "Email verified succesfully, you can now log in",
      code: "EMAIL_VERIFIED",
    });
  } catch (error) {
    next(error);
  }
};

export const resendEmailValidationToken: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    await sleep(500);

    const { email } = req.body;

    //Wil throw custom dbError with status 400 if user not found
    const user = await selectUserByEmail(email);

    if (user.emailVerified) {
      await sleep(800);
      sendResponse(res, 400, {
        status: "ERROR",
        code: "USER_ALREADY_VERiFIED",
        message: "Your email is already verified, no need to do it again",
      });
      return;
    }

    await deleteVerificationTokenByUserId(user.id);

    const token = randomBytes(32).toString("hex");
    await insertEmailVerifyToken(user.id, token);

    await sendVerificationEmail(
      email,
      `${user.firstname} ${user.lastname}`,
      "Please verify your email",
      token
    );

    sendResponse(res, 200, {
      status: "SUCCESS",
      code: "TOKEN_SENT",
      message: "Email sent, please check your inbox and spam folder",
    });
  } catch (error) {
    next(error);
  }
};
