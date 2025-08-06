const express = require("express");
const router = express.Router();
const db = require("../db");
const cloudinary = require("../utils/cloudinary");
const billUpload = require('../middleware/bills'); // multer config
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

router.post("/bills", billUpload.single("bills"), async (req, res) => {
  try {
    const { customerName, mobileNumber, orderDate } = req.body;

    // 1. Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const localFilePath = req.file.path;

    // 2. Upload PDF to Cloudinary
    const cloudResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "bills",
      resource_type: "raw", // 'raw' for non-image files like PDFs
    });

    // 3. Delete local file
    await unlinkAsync(localFilePath);

    // 4. Insert record into database
    const insertQuery = `
      INSERT INTO bills (cust_name, pdf, mobile, date)
      VALUES (?, ?, ?, ?)`;

    db.query(insertQuery, [customerName, cloudResult.secure_url, mobileNumber, orderDate], (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }

      res.json({
        success: true,
        message: "Bill uploaded and saved!",
        pdfUrl: cloudResult.secure_url
      });
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.get('/bills', async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM bills`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
