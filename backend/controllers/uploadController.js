require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const Progress = require('../models/Progress');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File
exports.uploadFile = async (req, res) => {
  try {
    console.log('➡️ Upload request received');

    if (!req.file) {
      console.error('❌ No file received');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📂 File received:', req.file.originalname);

    const fileUrl = req.file.path || req.file.secure_url;
    if (!fileUrl) {
      console.error('❌ Cloudinary URL missing');
      return res.status(500).json({ message: 'Upload failed: Cloudinary URL missing' });
    }

    // Save uploaded file details in MongoDB, including description
    const newProgress = new Progress({
      userId: req.user.id,
      fileUrl: fileUrl,
      fileType: req.file.mimetype.startsWith('image') ? 'image' : 'video',
      description: req.body.description || '', // Save description
    });

    await newProgress.save();

    console.log('✅ Upload successful:', fileUrl);
    res.status(201).json({ message: 'File uploaded successfully', fileUrl: fileUrl, description: newProgress.description });
  } catch (error) {
    console.error('❌ Upload failed:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// Fetch Uploaded Files
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Progress.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch uploads', error: error.message });
  }
};
