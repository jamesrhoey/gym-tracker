const express = require('express');
const { uploadFile, getUploads } = require('../controllers/uploadController');
const { requireAuth } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage settings for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gym-progress', // Folder where files will be stored in Cloudinary
    resource_type: 'auto',  // Supports images & videos
  },
});

// Set up Multer with Cloudinary storage
const upload = multer({ storage });

const router = express.Router();

// Upload file (POST)
router.post('/upload', requireAuth, upload.single('file'), uploadFile);

// Fetch uploaded files (GET)
router.get('/files', requireAuth, getUploads);

module.exports = router;
