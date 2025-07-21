// back-end/src/routes/indexRoute.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const messageRoute = require('./messageRoute');
const staticReportRoute = require('./staticReportRoute');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/messages', messageRoute);
router.use('/staticReport', staticReportRoute);

module.exports = router;