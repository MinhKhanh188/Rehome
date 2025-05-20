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


// private routes
router.get('/getPersonalPosts', authMiddleware, postController.getPersonalPosts);
router.post('/createPost', authMiddleware, upload.array('images'), postController.createPost);
router.delete('/deletePost/:id', authMiddleware, postController.deletePost);



module.exports = router;