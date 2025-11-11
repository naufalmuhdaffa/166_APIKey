const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT
});

const API_PREFIX = 'sk-sm-v1-';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create', async (req, res) => {
  try {
    const apiKey = API_PREFIX + crypto.randomBytes(24).toString('hex').toUpperCase();

    const sql = 'INSERT INTO api_keys (api_key, is_active) VALUES (?, 1)';
    await pool.execute(sql, [apiKey]);

    res.json({ apiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat API key' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
