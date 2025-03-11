const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'video'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
