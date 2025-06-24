import { User } from "./users";
import { Response } from "express";

export type InsertUser = (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => Promise<string | null>;

export type SelectUserByEmail = (email: string) => Promise<User>;

export type TokenType = "access" | "refresh" | "email-verification";

export type GenerateAndSetJwtCookie = (res: Response, id: string, type?: TokenType) => string;
