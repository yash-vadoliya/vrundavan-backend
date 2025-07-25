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
const multer = require('multer');
const { CloudinaryStorege } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const { param } = require('../routes/api_routes');

const storege = new CloudinaryStorege({
  cloudinary,
  param: {
    folder: 'products',
    allowed_formates: ['jpg','png','jpeg','webp']
  }
})

const upload = multer({storage});

module.exports = upload;

