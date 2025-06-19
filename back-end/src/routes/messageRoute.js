// back-end/src/routes/messageRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

router.post('/createOrGetConversation', authMiddleware(false), messageController.createOrGetConversation);
router.post('/sendMessage', authMiddleware(false), messageController.sendMessage);
router.get('/getMessages/:conversationId', authMiddleware(false), messageController.getMessages);
router.get('/getUserConversations', authMiddleware(false), messageController.getUserConversations);

module.exports = router;