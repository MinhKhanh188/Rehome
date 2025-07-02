// back-end/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/verify-reset-code', userController.verifyResetCode);
router.post('/resetPassword', userController.resetPassword);
router.post('/login/google', userController.loginWithGoogle);

// user routes
router.get('/profile', authMiddleware(false), userController.getUserProfile);
router.get('/getAllUsers', authMiddleware(true), userController.getAllUsers);
router.get('/getCoinHistory/:id', authMiddleware(false), userController.getCoinHistory);

//admin routes
router.post('/increaseCoin/:id', authMiddleware(true), userController.increaseCoin);
router.get('/findUserByUniqueId/:uniqueId', authMiddleware(true), userController.findUserByUniqueId);
router.get('/getAllCoinHistory', authMiddleware(true), userController.getAllCoinHistory);
router.post('/deleteUser', authMiddleware(true), userController.deleteUser);

module.exports = router;
