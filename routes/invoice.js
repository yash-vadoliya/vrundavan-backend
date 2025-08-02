const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("../db"); // Assuming a DB connection is already set up
const wbm = require("wbm");
const jsPDF = require("jspdf");

// 📌 POST route to receive image, convert to PDF, store it, save DB, send WhatsApp
router.post("/bills", async (req, res) => {
  try {
    // const {  filename, mobileNumber, orderDate, customerName, pdfBase64 } = req.body;

    // console.log(filename, mobileNumber, orderDate, customerName);

    // if ( !filename || !mobileNumber || !orderDate || !customerName || !pdfBase64) {
    //   return res.status(400).json({ success: false, message: "Missing required fields." });
    // }

    // const filePath = path.join(__dirname, "../public/invoice", filename);

    // // Ensure the directory exists
    // const dir = path.join(__dirname, "../public/invoice");
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true });
    // }

    // //save PDF from base64
    // const buffer = Buffer.from(pdfBase64, "base64");
    // fs.writeFileSync(filePath, buffer);

      const {customerName, mobileNumber, orderDate} = req.body;
    const {filename} = req.file;

    console.log(res.body);

    // Insert into database
    const insert = "INSERT INTO `bills` (`cust_name`, `pdf`, `mobile`, `date`) VALUES (?, ?, ?, ?)";
    db.query(insert, [customerName, filename, mobileNumber, orderDate], async (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }
      return res.json({
        success: true,
        message: "Bill saved successfully!",
        downloadLink: downloadLink
      });
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.get('/bills', async(req,res) => {
  try{
    const data = `SELECT * FROM bills;`
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports = router;
