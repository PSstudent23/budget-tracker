import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: "http://localhost:30041",
    credentials: true,
  })
);

/* ---------------- JSON ---------------- */
app.use(express.json());

/* ---------------- SESSION ---------------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "temporary-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  })
);

/* ---------------- DB TEST ---------------- */
app.get("/", async (_req: Request, res: Response) => {
  let conn;

  try {
    conn = await mysql.createConnection(process.env.DATABASE_URL!);

    const [db] = await conn.query<any[]>("SELECT DATABASE() AS db");
    const [tables] = await conn.query("SHOW TABLES");

    res.json({
      database: db[0].db,
      tables,
    });
  } catch (err) {
    res.json({ error: (err as Error).message });
  } finally {
    if (conn) await conn.end();
  }
});

/* ---------------- REGISTER ---------------- */
app.post("/users", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, monthly_income } = req.body;

  let conn;

  try {
    conn = await mysql.createConnection(process.env.DATABASE_URL!);

    const [result]: any = await conn.query(
      `INSERT INTO users (first_name, last_name, email, password, monthly_income)
       VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, email, password, monthly_income]
    );

    res.json({
      ok: true,
      user_id: result.insertId,
    });
  } catch (err) {
    res.json({
      ok: false,
      error: (err as Error).message,
    });
  } finally {
    if (conn) await conn.end();
  }
});

/* ---------------- LOGIN ---------------- */
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let conn;

  try {
    conn = await mysql.createConnection(process.env.DATABASE_URL!);

    const [rows]: any = await conn.query(
      `SELECT user_id, first_name, last_name, email
       FROM users
       WHERE email = ? AND password = ?`,
      [email, password]
    );

    if (!rows || rows.length === 0) {
      return res.json({
        ok: false,
        error: "Invalid email or password",
      });
    }

    const user = rows[0];

    /* ✅ STORE IN SESSION */
    req.session.user = user;

    res.json({
      ok: true,
      user,
    });
  } catch (err) {
    res.json({
      ok: false,
      error: (err as Error).message,
    });
  } finally {
    if (conn) await conn.end();
  }
});

/* ---------------- CHECK SESSION ---------------- */
app.get("/me", (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({
      ok: false,
    });
  }

  res.json({
    ok: true,
    user: req.session.user,
  });
});

/* ---------------- LOGOUT ---------------- */
app.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ ok: false });
    }

    res.clearCookie("connect.sid");

    res.json({ ok: true });
  });
});

/* ---------------- START SERVER ---------------- */
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});