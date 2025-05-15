// back-end/src/models/SavedItem.js
const mongoose = require('mongoose');

const savedItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
    savedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('savedItems', savedItemSchema);
  