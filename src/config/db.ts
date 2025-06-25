import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT!) || 3306,
  connectionLimit: 50,
});

const initDBConnection = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("MySQL DB connection established.");
  } catch (err) {
    console.error("Failed to connect to MySQL DB:", err);
    process.exit(1);
  }
};

export const closeDBConnection = async () => {
  await pool.end();
};

(async () => await initDBConnection())();

export default pool;
