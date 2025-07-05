const express = require('express');
const router = express.Router();
const scrapeNews = require('../utils/scrapeNews');
const Portfolio = require('../models/Portfolio');

// Mapping of symbols to possible company names
const symbolMap = {
  RELIANCE: ['Reliance', 'Reliance Industries'],
  TCS: ['TCS', 'Tata Consultancy', 'Tata Consultancy Services'],
  INFY: ['INFY', 'Infosys'],
  HDFCBANK: ['HDFCBANK', 'HDFC Bank'],
  ICICIBANK: ['ICICIBANK', 'ICICI Bank'],
  SBIN: ['SBIN', 'SBI', 'State Bank of India'],
  // Add more as needed
};

// POST /api/filtered-news - get news relevant to portfolio
router.post('/', async (req, res) => {
  let symbols = req.body.symbols;
  if (!symbols && req.body.userId) {
    // Fetch from MongoDB
    try {
      const portfolio = await Portfolio.findOne({ userId: req.body.userId });
      symbols = portfolio ? portfolio.symbols : [];
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch portfolio from DB' });
    }
  }
  if (!Array.isArray(symbols) || symbols.length === 0) {
    return res.status(400).json({ error: 'No portfolio symbols provided' });
  }
  try {
    const news = await scrapeNews();
    // Build a list of keywords to match (symbols + company names)
    const keywords = symbols.flatMap(symbol => {
      const upper = symbol.toUpperCase();
      return symbolMap[upper] ? symbolMap[upper] : [symbol];
    });
    // Filter news: include if any keyword is in the headline (case-insensitive, partial match)
    const filtered = news.filter(headline =>
      keywords.some(keyword =>
        headline.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    res.json({ filteredNews: filtered });
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter news' });
  }
});

module.exports = router; 