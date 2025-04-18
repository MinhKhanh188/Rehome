// models/Post.js
const postSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    productStatus: { type: String, enum: ['new', 'like-new', 'old'], required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String }],
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String },
    mapUrl: { type: String },
    status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Post', postSchema, 'posts');
  