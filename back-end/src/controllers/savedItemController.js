// back-end/src/controllers/savedItemController.js
const SavedItem = require('../models/SavedItem');
const Post = require('../models/Post');
const User = require('../models/User');

class savedItemController {
    // POST /saved-items/:postId
    async savePost(req, res) {
        try {
            const userId = req.user._id;
            const { postId } = req.params;

            // Check if post exists
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found 💔' });
            }

            // Check if already saved
            const exists = await SavedItem.findOne({ userId, productId: postId });
            if (exists) {
                return res.status(400).json({ error: 'Post already saved' });
            }

            const savedItem = new SavedItem({
                userId,
                productId: postId,
            });

            await savedItem.save();
            res.status(201).json({ message: 'Post saved successfully 💾' });
        } catch (error) {
            console.error('Save post error:', error);
            res.status(500).json({ error: 'Failed to save post 💔' });
        }
    }
    // GET /saved-items
    async getSavedPosts(req, res) {
        try {
            const userId = req.user._id;

            const savedItems = await SavedItem.find({ userId })
                .populate({
                    path: 'productId',
                    populate: [
                        { path: 'categoryId', select: 'name' },
                        { path: 'province', select: 'name' },
                        { path: 'sellerId', select: 'name profilePic' }
                    ]
                })
                .sort({ savedAt: -1 });

            const posts = savedItems
                .filter(item => item.productId)
                .map(item => ({
                    _id: item._id,       
                    postId: item.productId._id,       
                    name: item.productId.name,
                    price: item.productId.price,
                    images: item.productId.images,
                    productStatus: item.productId.productStatus,
                    status: item.productId.status,
                    category: item.productId.categoryId?.name || null,
                    province: item.productId.province?.name || null,
                    sellerName: item.productId.sellerId?.name || null,
                    sellerProfilePic: item.productId.sellerId?.profilePic || null,
                    savedAt: item.savedAt
                }))


            res.status(200).json(posts);
        } catch (error) {
            console.error('Get saved posts error:', error);
            res.status(500).json({ error: 'Failed to fetch saved posts 💔' });
        }
    }

    async removeSavedItem(req, res) {
        try {
            const userId = req.user._id;
            const { id } = req.params; // id = savedItem._id

            const item = await SavedItem.findById(id);

            if (!item) {
                return res.status(404).json({ error: 'Saved item not found 💔' });
            }

            // Ensure user owns this saved item
            if (item.userId.toString() !== userId) {
                return res.status(403).json({ error: 'You are not authorized to remove this saved item 🚫' });
            }

            await SavedItem.findByIdAndDelete(id);
            res.status(200).json({ message: 'Saved item removed successfully 🗑️' });
        } catch (error) {
            console.error('Remove saved item error:', error);
            res.status(500).json({ error: 'Failed to remove saved item 💔' });
        }
    }

}
module.exports = new savedItemController();
