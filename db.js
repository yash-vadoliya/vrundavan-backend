require ('dotenv').config();
const mysql = require('mysql2');

var con = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 0
});

con.query('SELECT 1', (err, results) => {
    if(err){
        console.log("Error to Connect Darabase",err);
    } else {
        console.log("Database Connect Successfully..");
    }
});

module.exports = con.promise();