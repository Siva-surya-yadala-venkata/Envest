const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  symbols: { type: [String], required: true }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema); 