const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// ❌ VULNERABLE ROUTE: SQL Injection Flaw
app.get('/api/v1/user/profile', async (req, res) => {
  const username = req.query.username;

  try {
    // Galti: Direct user input ko SQL query string mein inject kiya gaya hai
    const query = `SELECT id, username, email, role FROM users WHERE username = '${username}'`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Database Server Error", details: err.message });
  }
});

module.exports = app;
