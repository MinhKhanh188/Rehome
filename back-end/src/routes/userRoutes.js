// back-end/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware(false), userController.getUserProfile);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/getAllUsers', authMiddleware(true), userController.getAllUsers);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);

module.exports = router;
