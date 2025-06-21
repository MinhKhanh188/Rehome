// back-end/src/socket/index.js
const MessageModel = require('../models/Message');


function setupSocketIO(io) {
  io.on('connection', (socket) => {
    console.log('📡 User connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('send_message', async (data) => {
      const { conversationId, senderId, text } = data;

      try {
        const message = await MessageModel.create({ conversationId, senderId, text });
        io.to(conversationId).emit('receive_message', message);
      } catch (err) {
        console.error('❌ Error saving message:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('❎ User disconnected:', socket.id);
    });
  });
}

module.exports = setupSocketIO;
