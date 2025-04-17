// back-end/src/server.js
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors'); // Import CORS
const route = require('./routes/indexRoute');
const { engine } = require('express-handlebars');
const path = require('path');
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


// Routes init
route(app);

// Server init
app.listen(port, () => {
    console.log('Server running on port ', port);
});