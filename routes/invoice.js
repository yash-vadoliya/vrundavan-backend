const express = require("express");
const router = express.Router();
// const fs = require("fs");
// const path = require("path");
const db = require("../db");
// const cloudinary = require("../utils/cloudinary");
const billUpload = require('../middleware/bills'); // multer for receiving file
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink); // For deleting local file after billUpload

router.post("/bills", billUpload.single("bills"), async (req, res) => {
  try {
    const { customerName, mobileNumber, orderDate } = req.body;
    const pdf = req.file.path;

    const insertQuery = `
      INSERT INTO bills (cust_name, pdf, mobile, date)
      VALUES (?, ?, ?, ?)`;

    db.query(insertQuery, [customerName, pdf, mobileNumber, orderDate], (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }

      // return res.json({
      //   success: true,
      //   message: "Bill uploaded and saved!",
      //   pdfUrl: cloudResult.secure_url
      // });
      res.status(201).json({ message: "Product added successfully!",});
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.get('/bills', async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM bills`)
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports = router;
