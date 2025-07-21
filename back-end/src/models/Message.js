// back-end/src/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  text: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },
  sentAt: { type: Date, default: Date.now }
});

messageSchema.index({ conversationId: 1, sentAt: -1 });

module.exports = mongoose.model('messages', messageSchema);
