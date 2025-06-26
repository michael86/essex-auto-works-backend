import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { ExtractCookieData, GenerateAndSetJwtCookie } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "9h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment");
}

export const generateAndSetJwtCookie: GenerateAndSetJwtCookie = (
  res,
  id,
  type = "access"
): string => {
  const payload: JwtPayload = { id, type };

  const options: SignOptions = {
    // @ts-ignore - StringValue not exported, but "9h"/"15m"/etc. is valid
    expiresIn: JWT_EXPIRES_IN,
  };

  const token = jwt.sign(payload, JWT_SECRET, options);

  res.cookie(type, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 9, // 9 hours
  });

  return token;
};

export const extractCookieData: ExtractCookieData = async (cookie) => {
  const decoded = jwt.verify(cookie, JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Expected an object JWT payload, got string");
  }

  if (!decoded.id) throw new Error("Expected user id, but couldn't find it");

  return decoded.id as string;
};
