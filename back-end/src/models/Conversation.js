// back-end/src/models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
  ],
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('conversations', conversationSchema);
