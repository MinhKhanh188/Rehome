// back-end/src/server.js
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const https = require('https');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const { Server } = require('socket.io');

const port = process.env.PORT;
const app = express();

const databaseConnect = require('./config/db/databaseConnect');
databaseConnect.connect();

// Switch between local and production URLs
const isDev = process.env.NODE_ENV !== 'production';
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

// 🔐 HTTPS setup
const options = {
  key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem')),
};

const server = https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: frontendURL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Modular socket logic
const setupSocketIO = require('./socket');
setupSocketIO(io);

// ✅ Start server
server.listen(port, () => {
  console.log('🚀 HTTPS server running on port', port);
});
