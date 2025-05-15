// back-end/src/controllers/postController.js
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const cloudinary = require('../config/upload/cloudinary');
const fs = require('fs');

class postController {

  // POST /posts
  async createPost(req, res) {
    try {
      const {
        name,
        categoryId,
        province,
        description,
        productStatus,
        price,
        originalPrice,
        address,
        mapUrl,
        sellerId
      } = req.body;

      // Basic validation
      if (!name || !categoryId || !province || !productStatus || !price || !sellerId) {
        return res.status(400).json({ error: 'Missing required fields 💔' });
      }

      // Check if files exist
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded 💔' });
      }

      // Upload images to Cloudinary
      const imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'rehome-posts',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path); // Delete local temp file
      }

      // Create post document
      const newPost = new PostModel({
        name,
        categoryId,
        province,
        description,
        productStatus,
        price,
        originalPrice,
        address,
        mapUrl,
        sellerId,
        images: imageUrls
      });

      await newPost.save();

      res.status(201).json({ message: 'Post created successfully 💫', post: newPost });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Failed to create post 💔', details: error.message });
    }
  }




}

module.exports = new postController();
