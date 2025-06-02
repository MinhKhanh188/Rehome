// back-end/src/controllers/postController.js
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const CategoryModel = require('../models/Category');
const ProvinceModel = require('../models/Province');
const cloudinary = require('../config/upload/cloudinary');
const fs = require('fs');
const axios = require('axios');  

class postController {

  // GET personal posts
  async getPersonalPosts(req, res, next) {
    try {
      const userId = req.user.id;

      const posts = await PostModel.find({ sellerId: userId })
        .populate('categoryId', 'name')     // optional: show category name
        .sort({ createdAt: -1 });           // newest first

      res.status(200).json(posts);
    } catch (error) {
      console.error('Fetch personal posts error:', error);
      res.status(500).json({ error: 'Failed to fetch your posts 💔' });
    }
  }

  // DELETE a post by owner
  async deletePost(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const post = await PostModel.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found 💔' });
      }

      // Only allow the owner to delete
      if (post.sellerId.toString() !== userId) {
        return res.status(403).json({ error: 'You are not authorized to delete this post 🚫' });
      }

      await PostModel.findByIdAndDelete(postId);

      res.status(200).json({ message: 'Post deleted successfully 🗑️' });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ error: 'Failed to delete post 💔' });
    }
  }


  // POST /posts
  async createPost(req, res) {
    try {
      const { name, categoryId, province, description, productStatus, price, address, mapUrl } = req.body;

      const sellerId = req.user.id;

      // Basic validation
      if (!name || !categoryId || !province || !productStatus || !price || !sellerId) {
        console.error('Missing required fields: ' + JSON.stringify(req.body));
        return res.status(400).json({ error: 'Missing required fields 💔' });
      }

      // Check if files exist
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded 💔' });
      }

      // Upload images to Cloudinary
      const imageUrls = [];

      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'rehome-posts',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          });

          imageUrls.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload failed:', uploadErr);
        } finally {
          // This always runs, even if upload fails
          fs.unlink(file.path, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
          });
        }
      }


      // Create post document
      const newPost = new PostModel({
        name,
        categoryId,
        province,
        description,
        productStatus,
        price,
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
