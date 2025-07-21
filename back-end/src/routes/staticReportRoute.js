// back-end/src/routes/staticReportRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/staticReportController');

router.get('/user-stats', authMiddleware(false), controller.getUserStats);
router.get('/revenue', authMiddleware(false), controller.getRevenueStats);
router.get('/post-status', authMiddleware(false), controller.getPostStatusStats);
router.get('/best-selling-categories', authMiddleware(false), controller.getBestSellingCategories);

module.exports = router;
