import "dotenv/config";
import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path"
import session from "express-session";
import dotenv from "dotenv";
import usersRouter from "./routes/users.routes.js";
import transactionsRouter from "./routes/transactions.routes.js";
import budgetsRouter from "./routes/budgets.routes.js";
import goalsRouter from "./routes/goals.routes.js";
import notificationsRouter from "./routes/notifications.routes.js";
import { fileURLToPath } from "url";
import { getCategories } from "./db/database.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 30040;

app.use(cors({
  origin: "http://localhost:30041",
  credentials: true,
}));


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


app.get("/api", async (_req: Request, res: Response) => {
  let conn;

  try {
    conn = await mysql.createConnection("mysql://studenti:S039C8R7@localhost:3306/SISIII2026_89241250");

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
app.use("/api/transactions", transactionsRouter);

app.use("/api/budgets", budgetsRouter)

app.use("/api/goals", goalsRouter)

app.use("/api/notifications", notificationsRouter)
//Login and Register
app.use("/api/users", usersRouter);

app.get("/api/categories", async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({
      ok: false,
      message: "Not authenticated",
    });
  }

  try {
    const categories = await getCategories();

    res.json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
});


app.get("/api/me", (req: Request, res: Response) => {
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

app.post("/api/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ ok: false });
    }

    res.clearCookie("connect.sid");

    res.json({ ok: true });
  });
});



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reactBuildPath = __dirname;


app.use(express.static(reactBuildPath));

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});


app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});