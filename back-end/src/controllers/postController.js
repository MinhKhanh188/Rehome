// back-end/src/controllers/postController.js
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const CategoryModel = require('../models/Category');
const ProvinceModel = require('../models/Province');
const cloudinary = require('../config/upload/cloudinary');
const fs = require('fs');
const axios = require('axios');
const { log } = require('console');

// Utility to calculate coin cost
function calculateCoinCost(price) {
  if (price < 500_000) return 5000;
  if (price < 1_000_000) return 15000;
  if (price <= 5_000_000) return 30000;
  return 50000;
}

class postController {

  // GET all unverified posts with pagination + search
  async getAllUnverifiedPosts(req, res) {
    try {
      const { page = 1, name = '', province = '' } = req.query;
      const limit = 15;
      const skip = (page - 1) * limit;

      const filter = {
        isChecked: false,
        ...(name && { name: { $regex: name, $options: 'i' } }),
        ...(province && { province })
      };

      const posts = await PostModel.find(filter)
        .populate('categoryId', 'name')
        .populate('province', 'name')
        .populate('sellerId', 'name profilePic')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await PostModel.countDocuments(filter);

      res.status(200).json({
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: +page
      });
    } catch (error) {
      console.error('Fetch unverified posts error:', error);
      res.status(500).json({ error: 'Failed to fetch unverified posts 💔' });
    }
  }

  // GET all verified posts with pagination + search
  async getAllVerifiedPosts(req, res) {
    try {
      const { page = 1, name = '', province = '' } = req.query;
      const limit = 15;
      const skip = (page - 1) * limit;

      const filter = {
        isChecked: true,
        ...(name && { name: { $regex: name, $options: 'i' } }),
        ...(province && { province })
      };

      const posts = await PostModel.find(filter)
        .populate('categoryId', 'name')
        .populate('province', 'name')
        .populate('sellerId', 'name profilePic')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await PostModel.countDocuments(filter);

      res.status(200).json({
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: +page
      });
    } catch (error) {
      console.error('Fetch verified posts error:', error);
      res.status(500).json({ error: 'Failed to fetch verified posts 💔' });
    }
  }

  // PUT /posts/:id/verify — Admin verifies a post
  async verifyPost(req, res) {
    try {
      const { id } = req.params;
      const post = await PostModel.findByIdAndUpdate(
        id,
        { status: 'available', isChecked: true, updatedAt: Date.now() },
        { new: true }
      );
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post verified and status set to available', post });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


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
        sellerId: post.sellerId?._id || null,
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
      const userId = req.user._id;

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
      const userId = req.user._id;
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
      const sellerId = req.user._id;

      if (!name || !categoryId || !province || !productStatus || !price || !sellerId) {
        return res.status(400).json({ error: 'Missing required fields 💔' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded 💔' });
      }

      // Content filter
      const textsToCheck = [name, description, address];
      try {
        const filterResponse = await axios.post('http://127.0.0.1:5000/filter_content_for_rehome', {
          texts: textsToCheck,
        });

        const predictions = filterResponse.data.predictions || [];
        if (predictions.includes('unapproved')) {
          return res.status(400).json({ error: 'Your post contains inappropriate content 💔' });
        }
      } catch (filterError) {
        console.warn('⚠️ Content filter API failed:', filterError.message);
      }

      // Calculate coin cost
      const coinCost = calculateCoinCost(price);

      // Check user coin
      const user = await UserModel.findById(sellerId);
      if (!user || user.coin < coinCost) {
        return res.status(400).json({ error: 'Not enough coins to create this post 💸' });
      }

      // Deduct coins
      user.coin -= coinCost;
      await user.save();

      // Upload images
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
          fs.unlink(file.path, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
          });
        }
      }

      // Parse specs if needed
      let parsedSpecifications = specifications;
      if (typeof specifications === 'string') {
        try {
          parsedSpecifications = JSON.parse(specifications);
        } catch (err) {
          return res.status(400).json({ error: 'Invalid JSON in specifications 💔' });
        }
      }

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
        images: imageUrls
      });

      await newPost.save();
      res.status(201).json({ message: `Post created (−${coinCost} coins) 💫`, post: newPost });

    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Failed to create post 💔', details: error.message });
    }
  }


  // GET all VIP posts (không phân trang)
  async getAllVipPosts(req, res) {
    try {
      const { name = '', province = '' } = req.query;

      const filter = {
        isVip: true,
        isChecked: true, // chỉ lấy bài đã duyệt
        ...(name && { name: { $regex: name, $options: 'i' } }),
        ...(province && { province })
      };

      const posts = await PostModel.find(filter)
        .populate('categoryId', 'name')
        .populate('province', 'name')
        .populate('sellerId', 'name profilePic')
        .sort({ createdAt: -1 });

      res.status(200).json({ posts });
    } catch (error) {
      console.error('Fetch VIP posts error:', error);
      res.status(500).json({ error: 'Failed to fetch VIP posts 💔' });
    }
  }

  // GET post detail for admin (with full seller info)
  async adminGetPostDetail(req, res, next) {
    try {
      const postId = req.params.id;

      const post = await PostModel.findById(postId)
        .populate('categoryId', 'name')
        .populate('province', 'name')
        .populate('sellerId', 'name email phone profilePic createdAt');

      if (!post) {
        return res.status(404).json({ error: 'Post not found 💔' });
      }

      res.status(200).json({
        _id: post._id,
        name: post.name,
        category: post.categoryId?.name || null,
        province: post.province?.name || null,
        productStatus: post.productStatus,
        price: post.price,
        originalPrice: post.originalPrice || null,
        images: post.images,
        address: post.address,
        mapUrl: post.mapUrl,
        description: post.description,
        specifications: post.specifications || {},
        isChecked: post.isChecked,
        isVip: post.isVip,
        status: post.status,
        createdAt: post.createdAt,

        // Full seller info
        seller: {
          _id: post.sellerId?._id || null,
          name: post.sellerId?.name || null,
          email: post.sellerId?.email || null,
          phone: post.sellerId?.phone || null,
          profilePic: post.sellerId?.profilePic || null,
          joinedAt: post.sellerId?.createdAt || null,
        }
      });
    } catch (error) {
      console.error('Admin fetch post detail error:', error);
      res.status(500).json({ error: 'Failed to fetch post detail 💔' });
    }
  }

  // PUT /posts/:id/status
  async ChangePostStatus(req, res) {
    try {
      const userId = req.user._id;
      const postId = req.params.id;
      const { status } = req.body;

      // Validate status value
      const allowedStatuses = ['available', 'sold', 'hidden'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value 💔' });
      }

      // Find the post
      const post = await PostModel.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found 💔' });
      }

      // Check ownership
      if (post.sellerId.toString() !== userId) {
        return res.status(403).json({ error: 'You are not authorized to change this post 🚫' });
      }

      // Only allow if the post is approved
      if (!post.isChecked) {
        return res.status(400).json({ error: 'Post is not approved yet 💔' });
      }

      // Update status
      post.status = status;
      post.updatedAt = Date.now();
      await post.save();

      res.status(200).json({ message: `Post status updated to '${status}' ✅`, post });
    } catch (error) {
      console.error('Change post status error:', error);
      res.status(500).json({ error: 'Failed to change post status 💔' });
    }
  }




}

module.exports = new postController();
