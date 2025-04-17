// back-end/src/config/db/databaseConnect.js
const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.DB_URI;

async function connect() {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = { connect };   