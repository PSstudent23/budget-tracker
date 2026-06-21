import session from "express-session";

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "temporary-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.get('/', async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(process.env.DATABASE_URL);
    const [db] = await conn.query('SELECT DATABASE() AS db');
    const [tables] = await conn.query('SHOW TABLES');
    res.json({
      database: db[0].db,
      tables
    });
  } catch (err) {
    res.json({ error: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

app.use(express.json())

app.post('/users', async (req, res) => {
  const { first_name, last_name, email, password, monthly_income } = req.body
  let conn
  try {
    conn = await mysql.createConnection(process.env.DATABASE_URL)
    const [result] = await conn.query(
      'INSERT INTO users (first_name, last_name, email, password, monthly_income) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, password, monthly_income]
    )
    res.json({ ok: true, user_id: result.insertId })
  } catch (err) {
    res.json({ ok: false, error: err.message })
  } finally {
    if (conn) await conn.end()
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  let conn
  try {
    conn = await mysql.createConnection(process.env.DATABASE_URL)
    const [rows] = await conn.query(
      'SELECT user_id, first_name, last_name, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    )
    if (rows.length === 0) {
      return res.json({ ok: false, error: 'Invalid email or password' })
    }
    res.json({ ok: true, user: rows[0] })
  } catch (err) {
    res.json({ ok: false, error: err.message })
  } finally {
    if (conn) await conn.end()
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});