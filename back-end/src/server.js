// back-end/src/server.js
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const port = process.env.PORT;
const app = express();

const databaseConnect = require('./config/db/databaseConnect');
databaseConnect.connect();

// Use CORS Middleware
app.use(cors({
    origin: '*', // Allow all origins (change this to frontend URL in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Use morgan middleware with 'dev' format
app.use(morgan('dev'));
// Body parsing middleware
app.use(express.json());
// Parses JSON data
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
// Method override middleware
app.use(methodOverride('_method'));
// Static file serving middleware
app.use(errorHandler);

// Routes init - only use the indexRoute here
const indexRoute = require('./routes/indexRoute');
app.use('/api/', indexRoute);

// Server init
app.listen(port, () => {
    console.log('Server running on port ', port);
});
