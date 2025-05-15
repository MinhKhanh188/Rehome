// back-end/src/scripts/importData.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const Category = require('../models/Category');
const Province = require('../models/Province');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to DB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected ✅');
}).catch(err => {
    console.error('MongoDB connection error ❌', err);
    process.exit(1);
});

// Read data
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, './data/categories.json')));
const provinces = JSON.parse(fs.readFileSync(path.join(__dirname, './data/provinces.json')));

// Import function
const importData = async () => {
    try {
        await Category.deleteMany();
        await Province.deleteMany();

        await Category.insertMany(categories);
        await Province.insertMany(provinces);

        console.log('Data imported successfully ✅');
        process.exit();
    } catch (err) {
        console.error('Error importing data ❌', err);
        process.exit(1);
    }
};

// Run the function
importData();

// Close DB connection on exit
process.on('exit', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed ✅');
    });
});