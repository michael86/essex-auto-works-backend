import { RowDataPacket } from "mysql2";
import { User } from "./users";

export type TokenType = "email_verification" | "password_reset";

export interface SelectUser extends RowDataPacket, User {}
export interface UserVerificationToken extends RowDataPacket {
  email: string;
  userId: string;
  expiresAt: string;
  type: TokenType;
}

export type InsertToken = (
  userId: string,
  token: string,
  type: TokenType,
  expires?: Date
) => Promise<void>;

export interface SelectToken extends RowDataPacket {
  token: string;
}
