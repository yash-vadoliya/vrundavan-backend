require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,    
    user: process.env.DB_USER,     
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,  
    port: process.env.DB_PORT, 
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,           
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
