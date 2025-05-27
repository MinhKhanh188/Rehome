// back-end/src/controllers/postPublicController.js
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const CategoryModel = require('../models/Category');
const ProvinceModel = require('../models/Province');

class postPublicController {
    // GET posts with optional province filter
    async getPostsByProvince(req, res) {
    try {
        let { province } = req.query;

        if (province) {
            // Normalize to NFC (composed) form to handle accents properly
            province = province.normalize('NFC');

            // Find province document by normalized name (case-insensitive)
            const provinceDoc = await ProvinceModel.findOne({
                name: { $regex: new RegExp(`^${province}$`, 'i') }
            });

            if (!provinceDoc) {
                return res.status(404).json({ error: 'Province not found 💔' });
            }

            const posts = await PostModel.find({ province: provinceDoc._id })
                .populate('categoryId', 'name')
                .populate('sellerId', 'name profilePic')
                .sort({ createdAt: -1 });

            return res.status(200).json(posts);
        } else {
            // If no province query, return all posts
            const posts = await PostModel.find()
                .populate('categoryId', 'name')
                .populate('sellerId', 'name profilePic')
                .sort({ createdAt: -1 });

            return res.status(200).json(posts);
        }
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ error: 'Failed to fetch posts 💔' });
    }
}



    // GET list categories
    async getListCategory(req, res, next) {
        try {
            const categories = await CategoryModel.find().select('_id name');
            res.status(200).json(categories);
        } catch (error) {
            console.error('Fetch category error:', error);
            res.status(500).json({ error: 'Failed to fetch categories 💔' });
        }
    }

    // GET list provinces
    async getListProvince(req, res, next) {
        try {
            const provinces = await ProvinceModel.find().select('_id name');
            res.status(200).json(provinces);
        } catch (error) {
            console.error('Fetch province error:', error);
            res.status(500).json({ error: 'Failed to fetch provinces 💔' });
        }
    }
}

module.exports = new postPublicController();