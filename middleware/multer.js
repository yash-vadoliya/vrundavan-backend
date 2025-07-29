// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure upload directory exists
// const uploadDir = path.join(__dirname, "../public/images");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // Save files in 'public'
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // // File filter to allow only images
// // const fileFilter = (req, file, cb) => {
// //   if (file.mimetype.startsWith("/")) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only images are allowed!"), false);
// //   }
// // };

// const upload = multer({ storage });

// module.exports = upload;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

