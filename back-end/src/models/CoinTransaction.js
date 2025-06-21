// back-end/src/models/CoinTransaction.js
const mongoose = require('mongoose');

const coinTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  type: { type: String, enum: ['topup', 'deduct', 'post'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('coinTransactions', coinTransactionSchema);
