require('dotenv').config();
const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection failed", err);
  } else {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    console.log("DB connected:", res.rows[0]);
    
  }
});