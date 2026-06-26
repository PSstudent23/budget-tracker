import "dotenv/config";
import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import usersRouter from "./routes/users.routes.js";
import transactionsRouter from "./routes/transactions.routes.js";
import budgetsRouter from "./routes/budgets.routes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

// 1. CORS first
app.use(cors({
  origin: "http://localhost:30041",
  credentials: true,
}));

// 2. Body parsers BEFORE session and routes

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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

//Show Transactions
app.use("/transactions", transactionsRouter);

app.use("/budgets", budgetsRouter)


//Login and Register
app.use("/users", usersRouter);

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


app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});