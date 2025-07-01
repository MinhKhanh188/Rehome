// back-end/src/socket/index.js
const MessageModel = require('../models/Message');

function setupSocketIO(io) {
  io.on('connection', (socket) => {
    console.log('📡 User connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('send_message', (message) => {
      // Simply broadcast the message that was already created by the REST API
      io.to(message.conversationId).emit('receive_message', message);
    });

    socket.on('disconnect', () => {
      console.log('❎ User disconnected:', socket.id);
    });
  });
}

module.exports = setupSocketIO;
