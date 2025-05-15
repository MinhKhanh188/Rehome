// back-end/src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // Set up multer for file handling

router.post('/upload-image', upload.single('image'), postController.uploadImage);
router.post('/upload-images', upload.array('images', 5), postController.uploadImages);

module.exports = router;