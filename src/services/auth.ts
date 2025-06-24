import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { InsertUser, SelectUserByEmail } from "../types/auth";
import { DbError } from "../utils/sqlError";
import { SelectUser } from "../types/queries";
import { User } from "../types/users";

export const insertUser: InsertUser = async (firstname, lastname, email, password) => {
  try {
    const [res] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (firstname, lastname, email, password_hash, role) VALUES (?, ?, ?, ?, 'admin')",
      [firstname, lastname, email, password]
    );

    return `${res.insertId}`;
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new DbError("Email already exists", "EMAIL_EXISTS", 409);
    }

    throw new DbError("Database error", error.code);
  }
};

export const selectUserByEmail: SelectUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query<SelectUser[]>(
      `SELECT 
         id, 
         email, 
         password_hash AS passwordHash, 
         firstname, 
         lastname, 
         role, 
         email_verified AS emailVerified 
       FROM users 
       WHERE email = ?`,
      [email]
    );

    if (!rows[0]) throw new DbError("User not found", "INVALID_USER", 400);

    return rows[0] as User;
  } catch (error) {
    throw error;
  }
};
