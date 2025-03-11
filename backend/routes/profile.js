const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  uploadProfilePicture
} = require("../controllers/profile");

const multer = require("multer");

// Configure Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Profile Routes
router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);
router.post("/upload-picture", requireAuth, upload.single("profilePicture"), uploadProfilePicture);

module.exports = router;
