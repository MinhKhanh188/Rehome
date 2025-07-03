// back-end/src/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const { engine } = require('express-handlebars');
const http = require('http'); // ADD THIS
const errorHandler = require('./middleware/errorHandler');
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

console.log('Environment:', process.env.NODE_ENV);
console.log('Frontend URL:', frontendURL);

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

// ✅ CREATE HTTP SERVER
const server = http.createServer(app);

// ✅ ATTACH SOCKET.IO
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

// ✅ START HTTP SERVER
server.listen(port, "0.0.0.0", () => {
  console.log('🚀 HTTP server running on port', port);
});
