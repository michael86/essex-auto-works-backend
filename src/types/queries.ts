import { RowDataPacket } from "mysql2";
import { User } from "./users";

export interface SelectUser extends RowDataPacket, User {}
export interface UserEmailVerification extends RowDataPacket {
  email: string;
  expiresAt: string;
}

export type InsertEmailVerifyToken = (
  userId: string,
  token: string,
  expires: Date
) => Promise<void>;
