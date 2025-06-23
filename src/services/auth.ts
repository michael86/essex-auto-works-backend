import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { InsertUser } from "../types/auth";
import { DbError } from "../utils/sqlError";

export const insertUser: InsertUser = async (firstname, lastname, email, password) => {
  try {
    const [res] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (firstname, lastname, email, password_hash, role) VALUES (?, ?, ?, ?, 'admin')",
      [firstname, lastname, email, password]
    );

    return `${res.insertId}`;
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new DbError("Email already exists", error.code, 409);
    }

    throw new DbError("Database error", error.code);
  }
};
