// back-end/src/models/Province.js
const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('provinces', provinceSchema);