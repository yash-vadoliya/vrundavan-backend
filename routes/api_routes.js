const express = require("express");
const router = express.Router();
// const Item = require("../models/product");
const db = require('../db');
const upload = require('../middleware/multer');

// Product Route
// Product Insert Route
router.post("/product", upload.single("image"), async (req, res) => {
  
  try {
    const { product_name, description, category, price, stock, status } = req.body;
    // const image_url = req.file ? `/images/${req.file.filename}` : null;
    const image_url = req.file.path; // Cloudinary image URL

    if (!product_name || !description || !category || !price || !stock || !image_url) {
      return res.status(400).json({ error: "All fields are required, including image!" });
    }

    const sql = "INSERT INTO products (product_name, description, category, price, stock, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [product_name, description, category, price, stock, status, image_url];

    await db.query(sql, values);
    res.status(201).json({ message: "Product added successfully!", image_url });
  } catch (error) {
    console.error("Database Insert Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Product Read Route
router.get("/product", async (req, res) => {
  const items = await db.query('SELECT * FROM `products`');
  res.json(items);
});

// Product Read Route For Specific Product ID
router.get("/product/:id", async (req, res) => {
  try { 
    const { id } = req.params;
    const sql = "SELECT * FROM products WHERE id = ?";
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found!" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Database Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Product Update Route 
router.put("/product/:id", upload.single("image"), async (req, res) => {

  console.log("Received Data:", req.body);
  console.log("Uploaded File:", req.file);

  try {
    const { id } = req.params;
    const { product_name, description, category, price, stock, status } = req.body;
    let image_url = req.file ? `/images/${req.file.filename}` : null;

    // Fetch current image from database
    const [rows] = await db.query("SELECT image_url FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found!" });
    }
    // Keep the existing image if no new file is uploaded
    if (!image_url) {
      image_url = rows[0].image_url;
    }

    const sql = "UPDATE products SET product_name = ?, description = ?, category = ?, price = ?, stock = ?, status = ?, image_url = ? WHERE id = ?";
    const values = [product_name, description, category, price, stock, status, image_url, id];

    await db.query(sql, values);
    res.status(200).json({ message: "Product updated successfully!", image_url });
  } catch (error) {
    console.error("Database Update Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Product Delete Route
router.delete("/product/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM `products` WHERE id = ?", [req.params.id]);
    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User Routes
router.get("/user", async (req, res) => {
    const items = await db.query('SELECT `username`, `password` FROM `user`');
    res.json(items);
  });


// Feedback Routes
// Feedback Insert Route
router.post("/feedback", async (req,res) => {
  try {
    const { name, email, message_type, message } = req.body; // Extract data from request

    console.log("Received Data:", req.body); // Debugging

    // ✅ Correct SQL query
    const sql = "INSERT INTO `feedback` (`name`, `email`, `message_type`, `message`) VALUES (?, ?, ?, ?)";

    const [result] = await db.query(sql, [name, email, message_type, message]);

    res.status(201).json({ message: "Feedback submitted successfully!", result });
  } catch (error) {
      console.error("Database Insert Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
})

// Feedback Read Route
router.get("/feedback", async (req, res) => {
  const items = await db.query('SELECT * FROM `feedback`');
  res.json(items);
});

// Order Routes
// Order Insert Route
router.post("/orders", async (req, res) => {
  try {
    const { customerName, orderDate, products, totalPrice, mobile, paymentStatus } = req.body;

    // Insert order details into 'orders' table
    const [orderResult] = await db.query(
        "INSERT INTO orders (customer_name, order_date, total_price , mobile, payment_status) VALUES (?, ?, ?, ?, ?)",
        [customerName, orderDate, totalPrice, mobile, paymentStatus]
    );

    const orderId = orderResult.insertId;

    // Insert products into 'order_items' table
    const productValues = products.map((p) => [orderId, p.name, p.quantity, p.price]);
    await db.query("INSERT INTO order_items (order_id, product_name, quantity, price) VALUES ?", [productValues]);

    res.json({ message: "Order added successfully", orderId });
} catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
});

// Order Read Route
router.get("/orders", async (req, res) => {
  try {
    let orders;

    if (req.query.date) {
      console.log(req.query.date);
      const query = `
        SELECT id, customer_name, 
               DATE_FORMAT(order_date, '%d-%m-%Y') as order_date, 
               total_price, mobile, payment_status 
        FROM orders 
        WHERE DATE(order_date) = ?`; // Ensuring we match only the date
      const [result] = await db.query(query, [req.query.date]);
      orders = result;
    } else {
      const [result] = await db.query(`
        SELECT id, customer_name, 
               DATE_FORMAT(order_date, '%d-%m-%Y') as order_date, 
               total_price, mobile, payment_status 
        FROM orders`);
      orders = result;
    }

    if (!orders.length) {
      return res.json([]);
    }

    // Fetch products for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const [products] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
        return { ...order, products };
      })
    );

    res.json(ordersWithProducts);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Order Read Route For Specific Order ID
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [order] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
    const [products] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
    const orderWithProducts = { ...order, products };
    res.json(orderWithProducts); 

  } catch (error) { 
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } 
});


router.put("/orders/:id", async (req, res) => {
  const { customerName, orderDate, mobile, products, totalPrice, paymentStatus } = req.body;
  const orderId = req.params.id;

  try {
      // Update the main order table
      await db.query(
          "UPDATE `orders` SET `customer_name`=?, `order_date`=?, `mobile`=?, `total_price`=?, `payment_status`=? WHERE `id`=?",
          [customerName, orderDate, mobile, totalPrice, paymentStatus, orderId]
      );

      // Delete existing order items
      await db.query("DELETE FROM `order_items` WHERE `order_id`=?", [orderId]);

      // Insert updated products
      for (const product of products) {
          await db.query(
              "INSERT INTO `order_items` (`order_id`, `product_name`, `quantity`, `price`) VALUES (?, ?, ?, ?)",
              [orderId, product.name, product.quantity, product.price]
          );
      }

      res.status(200).json({ message: "Order updated successfully!" });
  } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
  }
});


// Order Delete Route
router.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM `orders` WHERE id = ?", [id]);
    await db.query("DELETE FROM `order_items` WHERE order_id = ?", [id]);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
