// models/ReportedPost.js 
const reportedPostSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('reportedPosts', reportedPostSchema);
  