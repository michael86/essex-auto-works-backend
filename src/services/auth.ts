import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { InsertUser, SelectUserByEmail } from "../types/auth";
import { DbError } from "../utils/sqlError";
import {
  InsertEmailVerifyToken,
  SelectUser,
  UserEmailVerification,
} from "../types/queries";
import { User } from "../types/users";

export const insertUser: InsertUser = async (
  firstname,
  lastname,
  email,
  password,
  token
) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "INSERT INTO users (id, firstname, lastname, email, password_hash) VALUES (UUID(), ?, ?, ?, ?)",
      [firstname, lastname, email, password]
    );

    const [[{ id: userId }]] = await connection.query<SelectUser[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await connection.query(
      "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );

    await connection.commit();
  } catch (error: any) {
    await connection.rollback();
    if ("code" in error) {
      console.error(error);
      throw new DbError("Error registering user ", error.code);
    }
    console.error("error registering user: ", error);
  } finally {
    connection.release();
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

export const selectVerificationToken = async (tokenReceived: string) => {
  const [row] = await pool.query<UserEmailVerification[]>(
    `SELECT 
      u.email, 
      u.id as userId,
      evt.expires_at AS expiresAt
     FROM 
      email_verification_tokens evt
     JOIN 
      users u ON evt.user_id = u.id
     WHERE 
      evt.token = ?`,
    [tokenReceived]
  );

  if (!row.length)
    throw new DbError(
      "Failed to find verification token",
      "INVALID_TOKEN",
      404
    );

  return row[0];
};

export const insertEmailVerifyToken: InsertEmailVerifyToken = async (
  userId,
  token,
  expires = new Date(Date.now() + 60 * 60 * 1000)
) => {
  await pool.query<ResultSetHeader>(
    "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expires]
  );
};

export const deleteVerificationToken = async (token: string) => {
  await pool.query<ResultSetHeader>(
    "DELETE FROM email_verification_tokens WHERE token = ?",
    [token]
  );
};

export const deleteVerificationTokenByUserId = async (userId: string) => {
  await pool.query<ResultSetHeader>(
    "DELETE FROM email_verification_tokens WHERE user_id = ?",
    [userId]
  );
};

export const setEmailVerified = async (userId: string, value: number) => {
  await pool.query<ResultSetHeader>(
    "UPDATE users SET email_verified = ? WHERE id = ?",
    [value, userId]
  );
};
