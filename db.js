require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,     // e.g., sql12.freesqldatabase.com
    user: process.env.DB_USER,     // your DB user
    password: process.env.DB_PASS, // your DB password
    database: process.env.DB_NAME, // your DB name
    waitForConnections: true,
    connectionLimit: 10,           // 10 is safer than 1000 for free DBs
    queueLimit: 0
});

// Test connection
pool.query('SELECT 1', (err, results) => {
    if (err) {
        console.error("❌ Error connecting to database:", err.message);
    } else {
        console.log("✅ Database connected successfully.");
    }
});

module.exports = pool.promise(); // use `await pool.query(...)` in routes
