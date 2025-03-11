const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 **Get user profile**
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Profile not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

// 📌 **Update user profile**
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, bio, workoutGoals } = req.body;

    // Only update fields that were provided in request
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (workoutGoals) updateData.workoutGoals = workoutGoals;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// 📌 **Upload Profile Picture**
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Convert image to Base64
    const fileStr = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "profile_pictures",
      public_id: req.user.id,
      overwrite: true,
    });

    // Update user profile with new image URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile picture uploaded successfully",
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile picture", error });
  }
};
