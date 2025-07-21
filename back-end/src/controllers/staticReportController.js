// back-end/src/controllers/staticReportController.js
const mongoose = require('mongoose');
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const CategoryModel = require('../models/Category');
const CoinTransactionModel = require('../models/CoinTransaction');

class StaticReportController {
    // 🧍 Get user role distribution
    async getUserStats(req, res) {
        try {
            // Get total users
            const totalUsers = await UserModel.countDocuments();

            // Get distinct seller IDs from posts
            const sellerIds = await PostModel.distinct('sellerId');

            return res.json([
                { role: "Tổng người dùng", count: totalUsers },
                { role: "Người bán", count: sellerIds.length }
            ]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to get user stats" });
        }
    }

    // 💰 Revenue by day (topups)
    async getRevenueStats(req, res) {
        try {
            const result = await CoinTransactionModel.aggregate([
                { $match: { type: 'topup' } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        revenue: { $sum: "$amount" }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            const formatted = result.map(item => ({
                date: item._id,
                revenue: item.revenue
            }));

            const totalRevenue = result.reduce((sum, item) => sum + item.revenue, 0);

            return res.json({
                totalRevenue,
                dailyRevenue: formatted
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to get revenue stats" });
        }
    }


    // 📦 Post status count
    async getPostStatusStats(req, res) {
        try {
            const includedStatuses = ['available', 'sold', 'hidden'];

            const result = await PostModel.aggregate([
                {
                    $match: { status: { $in: includedStatuses } }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const formatted = includedStatuses.map(status => {
                const found = result.find(r => r._id === status);
                return {
                    status: status.charAt(0).toUpperCase() + status.slice(1),
                    count: found ? found.count : 0
                };
            });

            return res.json(formatted);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to get post status stats" });
        }
    }


    // 🏆 Best-selling categories
    async getBestSellingCategories(req, res) {
        try {
            const result = await PostModel.aggregate([
                { $match: { status: 'sold' } },
                {
                    $group: {
                        _id: "$categoryId",
                        sold: { $sum: 1 }
                    }
                },
                { $sort: { sold: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: "$category" },
                {
                    $project: {
                        category: "$category.name",
                        sold: 1
                    }
                }
            ]);

            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to get best-selling categories" });
        }
    }
}

module.exports = new StaticReportController();
