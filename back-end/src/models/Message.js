// back-end/src/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  text: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('messages', messageSchema);
