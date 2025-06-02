// back-end/src/controllers/postController.js
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const CategoryModel = require('../models/Category');
const ProvinceModel = require('../models/Province');
const cloudinary = require('../config/upload/cloudinary');
const fs = require('fs');
const axios = require('axios');
const { log } = require('console');

class postController {

  // GET product detail by ID
  async getProductDetail(req, res) {
    try {
      const post = await PostModel.findById(req.params.productId)
        .populate('categoryId', 'name')
        .populate('province', 'name')
        .populate('sellerId', 'name profilePic');

      if (!post) return res.status(404).json({ error: 'Post not found 💔' });

      const filteredPost = {
        _id: post._id,
        name: post.name,
        category: post.categoryId?.name || null,
        province: post.province?.name || null,
        productStatus: post.productStatus,
        price: post.price,
        images: post.images,
        sellerName: post.sellerId?.name || null,
        sellerProfilePic: post.sellerId?.profilePic || null,
        address: post.address,
        mapUrl: post.mapUrl,
        description: post.description,
        specifications: post.specifications || {},
        uploadDate: post.createdAt,
        isChecked: post.isChecked,
        isVip: post.isVip,
        originalPrice: post.originalPrice || null,
        // views: post.views,
        status: post.status
      };

      res.status(200).json(filteredPost);
    } catch (error) {
      console.error('Fetch product detail error:', error);
      res.status(500).json({ error: 'Failed to fetch product 💔' });
    }
  }

  // GET personal posts
  async getPersonalPosts(req, res, next) {
    try {
      const userId = req.user.id;

      const posts = await PostModel.find({ sellerId: userId })
        .populate('categoryId', 'name')
        .populate('province', 'name')
        .populate('sellerId', 'name profilePic')
        .sort({ createdAt: -1 });

      const filteredPosts = posts.map(post => ({
        _id: post._id,
        name: post.name,
        category: post.categoryId?.name || null,
        province: post.province?.name || null,
        productStatus: post.productStatus,
        price: post.price,
        images: post.images,
        address: post.address,
        mapUrl: post.mapUrl,
        description: post.description,
        specifications: post.specifications || {},
        uploadDate: post.createdAt,
        isChecked: post.isChecked,
        isVip: post.isVip,
        originalPrice: post.originalPrice || null,
        createdAt: post.createdAt,
        status: post.status
      }));

      res.status(200).json(filteredPosts);
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
      const { name, categoryId, province, description, specifications, productStatus, price, originalPrice, address, mapUrl } = req.body;

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

      // 💡 Content filter check via Python API (safe try-catch)
      const textsToCheck = [name, description, address];
      try {
        const filterResponse = await axios.post('http://127.0.0.1:5000/filter_content_for_rehome', {
          texts: textsToCheck,
        });

        console.log('Text sent to filter:', textsToCheck);
        console.log('Filter API response:', filterResponse.data);

        const predictions = filterResponse.data.predictions || [];

        if (predictions.includes('unapproved')) {
          return res.status(400).json({ error: 'Your post contains inappropriate content 💔' });
        }
      } catch (filterError) {
        console.warn('⚠️ Content filter API failed. Skipping filter check:', filterError.message);
        // Optional: block post if filter fails
        // return res.status(503).json({ error: 'Content filter service unavailable 💔' });
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

      // ✅ Parse specifications if it's a JSON string
      let parsedSpecifications = specifications;
      if (typeof specifications === 'string') {
        try {
          parsedSpecifications = JSON.parse(specifications);
        } catch (err) {
          return res.status(400).json({ error: 'Invalid JSON in specifications 💔' });
        }
      }


      // Create post document
      const newPost = new PostModel({
        name,
        categoryId,
        province,
        description,
        specifications: parsedSpecifications,
        productStatus,
        price,
        originalPrice: originalPrice || null,
        address,
        mapUrl,
        sellerId,
        images: imageUrls || 'hehehe', // Use the uploaded image URLs
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
