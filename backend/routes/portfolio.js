const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// POST /api/portfolio - save portfolio
router.post('/', async (req, res) => {
  const { userId, symbols } = req.body;
  if (!userId || !Array.isArray(symbols)) {
    return res.status(400).json({ error: 'userId and symbols array required' });
  }
  try {
    const updated = await Portfolio.findOneAndUpdate(
      { userId },
      { symbols },
      { upsert: true, new: true }
    );
    res.json({ message: 'Portfolio saved', portfolio: updated.symbols });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save portfolio' });
  }
});

// GET /api/portfolio/:userId - get portfolio
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const portfolio = await Portfolio.findOne({ userId });
    res.json({ portfolio: portfolio ? portfolio.symbols : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

module.exports = { router }; 