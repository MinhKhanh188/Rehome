// back-end/src/controllers/messageController.js
const ConversationModel = require('../models/Conversation');
const MessageModel = require('../models/Message');
const UserModel = require('../models/User');

class MessageController {

    async createOrGetConversation(req, res) {
        const { participantId, postId } = req.body;
        const currentUserId = req.user._id;

        try {
            let convo = await ConversationModel.findOne({
                participants: { $all: [currentUserId, participantId] }
            });

            // If no conversation exists, create one and send the first message
            if (!convo) {
                convo = await ConversationModel.create({
                    participants: [currentUserId, participantId]
                });

                // 💬 Create initial message with postId
                await MessageModel.create({
                    conversationId: convo._id,
                    senderId: currentUserId,
                    text: "Món đồ này còn không shop ơi?",
                    postId: postId || null
                });
            } else {
                // Still send postId in a new message (no duplicate convo)
                await MessageModel.create({
                    conversationId: convo._id,
                    senderId: currentUserId,
                    text: ".", // Empty, just carries the post reference
                    postId: postId || null
                });
            }

            // ✅ Return conversation object (without postId here)
            res.status(200).json(convo);
        } catch (err) {
            console.error('💥 Conversation Error:', err);
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
            const rawMessages = await MessageModel.find({ conversationId })
                .sort({ sentAt: 1 })
                .populate({
                    path: 'postId',
                    select: 'name description images'
                })
                .lean();

            // 👇 Reformat postId ➜ post
            const messages = rawMessages.map(msg => {
                const { postId, ...rest } = msg;
                return {
                    ...rest,
                    post: postId || null, // if populated, becomes `post`
                };
            });

            res.status(200).json(messages);

        } catch (err) {
            console.error("💥 Message Fetch Error:", err);
            res.status(500).json({ message: 'Failed to fetch messages.' });
        }
    }


    async getUserConversations(req, res) {
        const currentUserId = req.user._id;

        try {
            const conversations = await ConversationModel.find({
                participants: currentUserId
            })
                .populate({
                    path: 'participants',
                    select: '_id name avatar email'
                })
                .lean();

            const convoWithLastMessage = await Promise.all(
                conversations.map(async (convo) => {
                    const lastMsg = await MessageModel.findOne({ conversationId: convo._id })
                        .sort({ sentAt: -1 })
                        .lean();

                    return {
                        ...convo,
                        lastMessage: lastMsg || null,
                    };
                })
            );

            res.status(200).json(convoWithLastMessage);
        } catch (err) {
            console.error('💥 Fetch Conversations Error:', err);
            res.status(500).json({ message: 'Failed to fetch conversations.' });
        }
    }



}

module.exports = new MessageController();