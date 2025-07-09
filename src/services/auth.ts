import pool from "../config/db";
import { ResultSetHeader } from "mysql2";
import { InsertUser, SelectUserByEmail } from "../types/auth";
import {
  TokenType,
  UserVerificationToken,
  InsertToken,
  SelectUser,
  SelectToken,
} from "../types/queries";
import { DbError } from "../utils/sqlError";

import { User } from "../types/users";

export const insertUser: InsertUser = async (firstname, lastname, email, password, token) => {
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
      "INSERT INTO tokens (user_id, token, type, expires_at) VALUES (?, ?, 'email_verification', ?)",
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

export const selectUserById: SelectUserByEmail = async (id) => {
  try {
    const [rows] = await pool.query<SelectUser[]>(
      `SELECT 
         id, 
         email, 
         password_hash AS passwordHash, 
         firstname AS firstName, 
         lastname AS lastName, 
         role, 
         email_verified AS emailVerified 
       FROM users 
       WHERE id = ?`,
      [id]
    );

    if (!rows[0]) throw new DbError("User not found", "INVALID_USER", 400);

    return rows[0] as User;
  } catch (error) {
    throw error;
  }
};

export const selectUserByEmail: SelectUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query<SelectUser[]>(
      `SELECT 
         id, 
         email, 
         password_hash AS passwordHash, 
         firstname AS firstName, 
         lastname AS lastName, 
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
  const [row] = await pool.query<UserVerificationToken[]>(
    `SELECT 
      u.email, 
      u.id as userId,
      t.expires_at AS expiresAt,
      t.type
     FROM 
      tokens t
     JOIN 
      users u ON t.user_id = u.id
     WHERE 
      t.token = ?`,
    [tokenReceived]
  );

  if (!row.length) throw new DbError("Failed to find verification token", "INVALID_TOKEN", 404);

  return row[0];
};

export const insertToken: InsertToken = async (
  userId,
  token,
  type,
  expires = new Date(Date.now() + 60 * 60 * 1000)
) => {
  await pool.query<ResultSetHeader>(
    "INSERT INTO tokens (user_id, token, type, expires_at) VALUES (?, ?, ?, ?)",
    [userId, token, type, expires]
  );
};

export const deleteToken = async (token: string) => {
  await pool.query<ResultSetHeader>("DELETE FROM tokens WHERE token = ?", [token]);
};

export const selectToken = async (token: string) => {
  const sql = `
    SELECT token
    FROM tokens
    WHERE token = ?
      AND expires_at > NOW()`;

  const [rows] = await pool.query<SelectToken[]>(sql, [token]);
  return rows.length > 0;
};

export const deleteTokensByUserAndType = async (user: string, type: TokenType) => {
  await pool.query("DELETE FROM tokens WHERE user_id = ? AND type = ?", [user, type]);
};

export const setEmailVerified = async (userId: string, value: number) => {
  await pool.query<ResultSetHeader>("UPDATE users SET email_verified = ? WHERE id = ?", [
    value,
    userId,
  ]);
};

export const updateUserPassword = async (id: string, password: string) => {
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [password, id]);
};
