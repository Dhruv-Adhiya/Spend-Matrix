require('dotenv').config();
const express = require("express");
const pool = require("./config/db");
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
const PORT = 5000;

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection failed", err);
  } else {
    console.log("DB connected:", res.rows[0]);
  }
});

app.use('/api/auth', authRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authMiddleware = require('./middleware/authMiddleware');

app.get('/api/test', authMiddleware, (req, res) => {
  res.json({ message: "Protected route working", user: req.user });
});