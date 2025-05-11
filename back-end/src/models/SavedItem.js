// models/SavedItem.js
const savedItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    savedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('savedItems', savedItemSchema);
  