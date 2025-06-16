// back-end/src/routes/indexRoute.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const messageRoute = require('./messageRoute');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/messages', messageRoute);

module.exports = router;