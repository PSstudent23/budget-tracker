
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
  monthly_income: number;
}

export interface Transaction extends RowDataPacket {
  transaction_id: number;
  user_id: number;
  category_id: number;
  amount: number;
  date: Date;
  description: string;
  created_at: Date;
  goal_id: number;
}

export interface Budgets extends RowDataPacket {
  budget_id: number
  user_id: number;
  category_id: number;
  start_date: string;
  end_date: string;
  budget_limit: string;
  is_active: boolean;
  created_at: string;
}

//Login
export const authUser = async (email: string): Promise<UserLogin[]> => {
  const [rows] = await pool.query<UserLogin[]>(
    `SELECT user_id, first_name, last_name, email, password, monthly_income
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

//Full texts
//	transaction_id 	user_id 	category_id 	amount 	date 	description 	created_at 	goal_id 	

export const getTransactions = async (
  user_id: number,
  
): Promise<Transaction[]> => {
  const [rows] = await pool.query<Transaction[]>(
    `SELECT * FROM transactions WHERE user_id = ?`,
    [user_id]
  );

  return rows;
};

export const addTransaction = async (
  user_id: number,
  category_id: number,
  amount: number,
  date: string,
  description: string,
  goal_id: number | null
): Promise<Transaction[]> => {
   const [rows] = await pool.query<Transaction[]>(
    `INSERT INTO transactions(user_id, category_id, amount, date, description, created_at, goal_id)
    VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
    [user_id,category_id,amount,date,description, goal_id]
  );

  return rows;
};

export const getBudgets = async (
  user_id: number,
  
): Promise<Budgets[]> => {
  const [rows] = await pool.query<Budgets[]>(
    `SELECT * FROM budgets WHERE user_id = ?`,
    [user_id]
  );

  return rows;
};

export const addBudget = async (
  user_id: number,
  category_id: number,
  start_date: number,
  end_date: string,
  budget_limit: number,
  is_active: boolean
): Promise<Transaction[]> => {
   const [rows] = await pool.query<Transaction[]>(
    `INSERT INTO budgets(user_id, category_id, start_date, end_date, budget_limit, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [user_id,category_id,start_date,end_date,budget_limit, is_active]
  );

  return rows;
};
