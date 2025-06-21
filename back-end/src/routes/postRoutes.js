// back-end/src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postPublicController = require('../controllers/postPublicController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // Set up multer for file handling

// public routes
router.get('/getListCategories', postPublicController.getListCategory);
router.get('/getListProvinces', postPublicController.getListProvince);
router.get('/province', postPublicController.getPostsByProvince);
router.get('/allVipPosts', postController.getAllVipPosts);

// user routes
router.get('/productDetail/:productId', postController.getProductDetail);



// private routes
router.get('/getPersonalPosts', authMiddleware(false), postController.getPersonalPosts);
router.post('/createPost', authMiddleware(false), upload.array('images'), postController.createPost);
router.delete('/deletePost/:id', authMiddleware(false), postController.deletePost);

// admin routes
router.get('/unverifiedPosts', authMiddleware(true), postController.getAllUnverifiedPosts);
router.get('/verifiedPosts', authMiddleware(true), postController.getAllVerifiedPosts);
router.put('/verify/:id', authMiddleware(true), postController.verifyPost);
router.get('/viewDetailPost/:id', authMiddleware(true), postController.adminGetPostDetail);

module.exports = router;