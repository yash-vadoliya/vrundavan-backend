const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const billStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bills',
    allowed_formats: ['pdf']
  }
});

const billUpload = multer({ storage: billStorage });

module.exports = billUpload;