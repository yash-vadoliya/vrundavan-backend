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
    const {  filename, mobileNumber, orderDate, customerName, pdfBase64 } = req.body;

    console.log(filename, mobileNumber, orderDate, customerName);

    if ( !filename || !mobileNumber || !orderDate || !customerName || !pdfBase64) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const filePath = path.join(__dirname, "../public/invoice", filename);

    // Ensure the directory exists
    const dir = path.join(__dirname, "../public/invoice");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    //save PDF from base64
    const buffer = Buffer.from(pdfBase64, "base64");
    fs.writeFileSync(filePath, buffer);

    // Insert into database
    const insert = "INSERT INTO `bills` (`cust_name`, `pdf`, `mobile`, `date`) VALUES (?, ?, ?, ?)";
    db.query(insert, [customerName, filename, mobileNumber, orderDate], async (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }

      // ✅ Generate custom alias download link (use ngrok URL here)
      // const downloadLink = `https://845a-2401-4900-8fc4-4166-1c77-2176-88c9-ad1a.ngrok-free.app/download/${filename}`; // Update with your ngrok link
      // const message = `🧾 *Vrundavan Dairy Farm Bill*\n\n👤 *Name:* ${customerName}\n📅 *Date:* ${orderDate}\n\n📥 *Download your bill here:*\n${downloadLink}`;

      // // ✅ Send WhatsApp
      // try {
      //   await wbm.start({ showBrowser: false });
      //   await wbm.send([`+91${mobileNumber}`], message);
      //   await wbm.end();

      //   return res.json({ success: true, message: "Bill saved and WhatsApp message sent!" });
      // } catch (msgErr) {
      //   console.error("WhatsApp Error:", msgErr);
      //   return res.status(500).json({ success: false, message: "Failed to send WhatsApp message." });
      // }

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

// ✅ Alias download route
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../public/invoice", filename);
  const alias = `Vrundavan_Bill_${filename}`; // Custom name for download

  res.download(filePath, alias, (err) => {
    if (err) {
      console.error("Download Error:", err);
      res.status(404).send("Bill not found.");
    }
  });
});

module.exports = router;
