// back-end/src/controllers/messageController.js
const ConversationModel = require('../models/Conversation');
const MessageModel = require('../models/Message');
const UserModel = require('../models/User');

class MessageController {

    async createOrGetConversation(req, res) {
        const { productId, participantId } = req.body;
        const currentUserId = req.user._id;

        try {
            let convo = await ConversationModel.findOne({
                productId,
                participants: { $all: [currentUserId, participantId] },
            });

            if (!convo) {
                convo = await ConversationModel.create({
                    productId,
                    participants: [currentUserId, participantId],
                });
            }

            res.status(200).json(convo);
        } catch (err) {
            res.status(500).json({ message: 'Failed to get or create conversation.' });
        }
    }

    async sendMessage(req, res) {
        const { conversationId, text } = req.body;
        const senderId = req.user._id;

        try {
            const message = await MessageModel.create({
                conversationId,
                senderId,
                text,
            });

            // Optional: emit via socket here if needed

            res.status(201).json(message);
        } catch (err) {
            res.status(500).json({ message: 'Message sending failed.' });
        }
    }

    async getMessages(req, res) {
        const { conversationId } = req.params;

        try {
            const messages = await MessageModel.find({ conversationId }).sort({ sentAt: 1 });
            res.status(200).json(messages);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch messages.' });
        }
    }


}

module.exports = MessageController;