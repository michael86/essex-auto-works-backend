import { User } from "./users";

export type InsertUser = (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => Promise<string | null>;

export type SelectUserByEmail = (email: string) => Promise<User>;
