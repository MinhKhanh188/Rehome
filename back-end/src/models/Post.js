// back-end/src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'provinces', required: true },
  description: { type: String },
  specifications: {
    type: Map,
    of: String,
    default: {},
  },
  productStatus: { type: String, enum: ['Mới', 'Like-new', 'Cũ'], required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String }],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  address: { type: String, required: true },
  mapUrl: { type: String },
  status: { type: String, enum: ['available', 'sold', 'pending', 'hidden'], default: 'pending' },
  isChecked: { type: Boolean, default: false },
  isVip: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('posts', postSchema);
