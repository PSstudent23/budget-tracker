
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "studenti",
  password: process.env.DB_PASSWORD || "S039C8R7",
  database: process.env.DB_NAME || "SISIII2026_89241250",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;


export interface UserLogin extends RowDataPacket {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  monthly_income: number | null;
}

export interface Transaction extends RowDataPacket {
  transaction_id: number;
  user_id: number;
  category_id: number;
  amount: number;
  date: Date;
  description: string;
  created_at: Date;
  goal_id: number | null;
}

//Login
export const authUser = async (email: string): Promise<UserLogin[]> => {
  const [rows] = await pool.query<UserLogin[]>(
    `SELECT user_id, first_name, last_name, email, password
     FROM users
     WHERE email = ?`,
    [email]
  );

  return rows;
};

//Register
export const createUser = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  monthly_income: number | null
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (first_name, last_name, email, password, monthly_income)
     VALUES (?, ?, ?, ?, ?)`,
    [first_name, last_name, email, password, monthly_income]
  );

  return result;
};

export const getTransactions = async (
  userId: number
): Promise<Transaction[]> => {
  const [rows] = await pool.query<Transaction[]>(
    `SELECT * FROM transactions WHERE user_id = ?`,
    [userId]
  );

  return rows;
};