
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
  category_name: string;
  amount: number;
  date: Date;
  description: string;
  created_at: Date;
  goal_id: number;

  attachment: Attachment | null;
}

export interface Attachment extends RowDataPacket {
  attachment_id: number;
  transaction_id: number;
  filename: string;
  file_type: string;
  uploaded_at: Date;
}

export interface Budget extends RowDataPacket {
  budget_id: number
  user_id: number;
  category_id: number;
  start_date: string;
  end_date: string;
  budget_limit: string;
  is_active: boolean;
  created_at: string;
}

export interface Goal extends RowDataPacket {
  goal_id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  status: "not_started" | "in_progress" | "behind" | "completed";
  priority: number;
  created_at: string;
  completed_at: string;
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

export const getTransactions = async (
  user_id: number,
  
): Promise<Transaction[]> => {
  const [rows] = await pool.query<Transaction[]>(
    `SELECT t.*, c.name AS category_name, a.attachment_id, a.filename
    FROM transactions t
    JOIN categories c ON t.category_id = c.category_id
    LEFT JOIN attachment a ON a.transaction_id = t.transaction_id
    WHERE t.user_id = ?`,
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
): Promise<ResultSetHeader> => {
   const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO transactions(user_id, category_id, amount, date, description, created_at, goal_id)
    VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
    [user_id,category_id,amount,date,description, goal_id]
  );

  return result;
};

export const deleteTransaction = async (
    transaction_id: number
): Promise<ResultSetHeader> => {

  await pool.query(
    "DELETE FROM attachment WHERE transaction_id = ?",
    [transaction_id]
  );


  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM transactions WHERE transaction_id = ?`,
    [transaction_id]
  );

  return result;
};


export const getBudgets = async (
  user_id: number,
  
): Promise<Budget[]> => {
  const [rows] = await pool.query<Budget[]>(
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
): Promise<ResultSetHeader> => {
   const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO budgets(user_id, category_id, start_date, end_date, budget_limit, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [user_id,category_id,start_date,end_date,budget_limit, is_active]
  );

  return result;
};

export const deleteBudget = async (
    budget_id: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM budgets WHERE budget_id = ?`,
    [budget_id]
  );

  return result;
};

export const getGoals = async (
  user_id: number,
  
): Promise<Goal[]> => {
  const [rows] = await pool.query<Goal[]>(
    `SELECT * FROM goals WHERE user_id = ?`,
    [user_id]
  );

  return rows;
};

export const addGoal = async (
  user_id: number,
  name: string,
  target_amount: number,
  target_date: string,
  status: "not_started" | "in_progress" | "behind" | "completed",
  priority: number,
): Promise<ResultSetHeader> => {
   const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO goals(user_id, name, target_amount, current_amount, target_date, status, priority, created_at)
    VALUES (?, ?, ?, 0, ?, ?, ?, NOW())`,
    [user_id,name,target_amount,target_date, status, priority]
  );

  return result;
};

export const deleteGoal = async (
    goal_id: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM goals WHERE goal_id = ?`,
    [goal_id]
  );

  return result;
};


export const checkPassword = async (
  user_id: number,
): Promise<UserLogin[]> => {
  const [rows] = await pool.query<UserLogin[]>(
    `SELECT password FROM users WHERE user_id = ?`,
    [user_id]
  );

  return rows;
};

export const updateUser = async (
  user_id: number,
  first_name: string,
  last_name: string,
  email: string,
  monthly_income: number,
  password: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE users SET first_name = ?, last_name = ?, email = ?, monthly_income = ?, password = ?
     WHERE user_id = ?`,
    [first_name, last_name, email, monthly_income, password, user_id]
  );

  return result;
};

export const getTransactionSum = async (
  user_id: number
): Promise<number> => {
  const [rows] = await pool.query<any[]>(
    `SELECT SUM(amount) AS total FROM transactions WHERE user_id = ?`,
    [user_id]
  );

  return rows[0].total || 0;
};

export const addFile = async (
  user_id: number,
  transaction_id: number,
  filename: string,
  file_type: string,
  file_data: Buffer
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO attachment 
     (user_id, transaction_id, filename, file_type, file_data, uploaded_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [user_id, transaction_id, filename, file_type, file_data]
  );

  return result;
};