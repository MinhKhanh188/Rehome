// back-end/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  loginProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  coin: { type: Number, default: 0 },
  uniqueId: { type: String, required: true, unique: true },
  profilePic: { type: String },
  phoneNumber: { type: String },
  facebookUrl: { type: String },
  location: { type: String },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);
