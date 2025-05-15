// back-end/src/models/ReportedPost.js
const mongoose = require('mongoose');

const reportedPostSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    reason: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('reportedPosts', reportedPostSchema);
  