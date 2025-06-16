
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

// CORS setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('🔌 New socket connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined room: ${conversationId}`);
    });

    socket.on('send_message', (data) => {
        io.to(data.conversationId).emit('receive_message', {
            ...data,
            sentAt: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

// ✅ Start server
server.listen(port, () => {
    console.log('Server running on port', port);
});
