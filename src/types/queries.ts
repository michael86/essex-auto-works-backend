import { RowDataPacket } from "mysql2";
import { User } from "./users";

export interface SelectUser extends RowDataPacket, User {}
export type InsertEmailVerifyToken = (
  userId: string,
  token: string,
  expires: Date
) => Promise<void>;
