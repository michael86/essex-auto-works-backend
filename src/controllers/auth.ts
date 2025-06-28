import { randomBytes } from "crypto";
import { RequestHandler } from "express";
import {
  deleteToken,
  deleteTokensByUserAndType,
  insertToken,
  insertUser,
  selectUserByEmail,
  selectUserById,
  selectVerificationToken,
  setEmailVerified,
  updateUserPassword,
} from "../services/auth";
import bcrypt from "bcrypt";
import { extractCookieData, generateAndSetJwtCookie } from "../utils/jwt";
import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { getTokenTimeRemaining, sleep } from "../utils";
import { sendResponse } from "../utils/sendResponse";
import { sendPasswordResetEmail } from "../emails/sendPasswordResetLink";
import { sendPasswordChangedEmail } from "../emails/sendPasswordChangedEmail";
import { DbError } from "../utils/sqlError";

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
    if (error instanceof DbError) {
      sendResponse(res, 409, {
        status: "ERROR",
        code: error.code,
        message: error.message,
      });
      return;
    }
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
        code: "INVALID_TOKEN",
      });
      return;
    }

    if (storedToken.type !== "email_verification") {
      sendResponse(res, 400, {
        status: "ERROR",
        message: "Invalid token or token not found",
        code: "INVALID_TOKEN",
      });
    }

    await deleteToken(token);
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

    await deleteTokensByUserAndType(user.id, "email_verification");

    const token = randomBytes(32).toString("hex");
    await insertToken(user.id, token, "email_verification");

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

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    await sleep(300);
    const { email } = req.body;

    let user;
    try {
      user = await selectUserByEmail(email);
    } catch {
      //selectUser throws customDB error if no user found, so respond as if all okay, but hang for a bit!
      await sleep(800);
      sendResponse(res, 200, {
        status: "SUCCESS",
        code: "PASSWORD_EMAIL_SENT",
        message:
          "A reset link has been sent to the email provided, please check you spam",
      });
      return;
    }

    const token = randomBytes(32).toString("hex");
    await deleteTokensByUserAndType(user.id, "password_reset");
    await insertToken(user.id, token, "password_reset");

    await sendPasswordResetEmail(
      email,
      `${user.firstname} ${user.lastname}`,
      "Reset Password",
      token
    );

    sendResponse(res, 200, {
      status: "SUCCESS",
      code: "PASSWORD_EMAIL_SENT",
      message:
        "A reset link has been sent to the email provided, please check you spam",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { token: recievedToken } = req.params;
    const { password } = req.body;

    const token = await selectVerificationToken(recievedToken);

    if (
      getTokenTimeRemaining(new Date(token.expiresAt)) <= 0 ||
      token.type !== "password_reset"
    ) {
      sendResponse(res, 403, {
        status: "ERROR",
        code: "INVALID_TOKEN",
        message: "Link expired or invalid, please request a new one",
      });
      return;
    }

    const user = await selectUserById(token.userId);
    const newPassHash = await bcrypt.hash(password, ROUNDS);

    await updateUserPassword(user.id, newPassHash);
    await deleteTokensByUserAndType(user.id, "password_reset");

    await sendPasswordChangedEmail(
      user.email,
      `${user.firstname} ${user.lastname}`
    );

    sendResponse(res, 200, {
      status: "SUCCESS",
      code: "PASSWORD_CHANGED",
      message:
        "Your password has been updated, please login using your new credentials",
    });
  } catch (error) {
    next(error);
  }
};

export const validateUserJwt: RequestHandler = async (req, res, next) => {
  try {
    await sleep(500);
    const { token } = req.cookies;

    if (!token) {
      sendResponse(res, 403, {
        status: "ERROR",
        code: "INVALID_SESSION",
        message: "User is not verified",
      });
      return;
    }

    let userId: string;
    try {
      userId = await extractCookieData(token);
    } catch (error) {
      console.error(error);
      await sleep(800);
      sendResponse(res, 403, {
        status: "ERROR",
        code: "INVALID_SESSION",
        message: "User is not verified",
      });
      return;
    }

    const user = await selectUserById(userId);

    sendResponse(res, 200, {
      status: "SUCCESS",
      code: "USER_VALID",
      message: "User is verified",
      data: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
