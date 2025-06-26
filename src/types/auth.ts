import { JwtPayload } from "jsonwebtoken";
import { User } from "./users";
import { Response } from "express";

export type InsertUser = (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  token: string
) => Promise<void>;

export type SelectUserByEmail = (email: string) => Promise<User>;

export type TokenType = "access" | "refresh";

export interface ExtendedJwtPayload extends JwtPayload {
  id: string;
  type: "access" | "refresh";
}

export type GenerateAndSetJwtCookie = (res: Response, id: string, type?: TokenType) => string;

export type ExtractCookieData = (cookie: string) => Promise<string>;
