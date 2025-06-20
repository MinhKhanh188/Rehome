
// back-end/src/server.js
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const { Server } = require('socket.io');

const port = process.env.PORT;
const app = express();

const databaseConnect = require('./config/db/databaseConnect');
databaseConnect.connect();

// Switch between local and production URLs
const isDev = process.env.NODE_ENV === 'development';
const frontendURL = isDev
    ? process.env.FRONTEND_LOCAL_URL
    : process.env.FRONTEND_PRODUCTION_URL_DEV;

// CORS setup
app.use(cors({
    origin: frontendURL,
    credentials: true
}));



app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
const indexRoute = require('./routes/indexRoute');
app.use('/api/', indexRoute);

app.use(errorHandler);

// 🔧 HTTP and Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: frontendURL,
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('send_message', async (data) => {
        const { conversationId, senderId, text } = data;

        // Save to DB
        const message = await MessageModel.create({ conversationId, senderId, text });

        // Emit to all clients in the room
        io.to(conversationId).emit('receive_message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// ✅ Start server
server.listen(port, () => {
    console.log('Server running on port', port);
});
