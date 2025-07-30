// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true }, // Firebase UID
  name: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('Profile', profileSchema);
