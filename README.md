# 🐄 Vrundavan Dairy Farm Backend

Vrundavan Dairy Farm Backend is a Node.js + Express.js API that powers the dairy management system. This API handles customer orders, product data, billing, and integrates WhatsApp support for sending invoices as PDFs. It is connected to a MySQL database and supports secure and scalable management of dairy operations.

## 🚀 Features

- RESTful API architecture
- Customer and order management
- PDF invoice generation using `jsPDF` and `autoTable`
- WhatsApp integration for invoice delivery (Twilio API)
- MySQL database connectivity with connection pooling
- Modular codebase for maintainability

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **WhatsApp Messaging**: Twilio API
- **Environment Management**: dotenv

## 📁 Project Structure

vrundavan-backend/
├── routes/ # API route and business logic
│ ├── api_routes/ # All primary API routes
│ └── invoice/ # Invoice-specific API routes
├── public/
│ ├── invoices/ # Stored invoice PDFs
│ └── images/ # Uploaded product images
├── middleware/
│ └── multer/ # Image and file upload handling
├── .env # Environment variables
├── server.js # Main entry point
└── package.json # Project metadata and dependencies

## 📦 Installation

### Prerequisites

- Node.js v14+
- MySQL
- Twilio account (for WhatsApp)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/vrundavan-backend.git
cd vrundavan-backend
 
2. Install dependencies

npm install

3. Setup environment variables

Create a .env file:

DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

PORT = 

4. Start the server

npm start

The server will run on http://localhost:3000.

📧 Author
Yash Vadoliya
📧 vadoliyayash1409@gmail.com
🔗 GitHub - yash-vadoliya

🛡 License
This project is licensed under the MIT License.


Let me know if you'd like to include screenshots, Postman collections, or Swagger documentation as well.

#
