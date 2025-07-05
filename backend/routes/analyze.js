const express = require('express');
const router = express.Router();
const analyzeNews = require('../utils/openai');

// POST /api/analyze - analyze news impact
router.post('/', async (req, res) => {
  console.log('Received /analyze request:', req.body);
  const { headlines, symbols } = req.body;
  if (!Array.isArray(headlines) || !Array.isArray(symbols) || headlines.length === 0 || symbols.length === 0) {
    return res.status(400).json({ error: 'headlines and symbols arrays required and must not be empty' });
  }
  try {
    const analysis = await analyzeNews(headlines, symbols);
    res.json({ analysis });
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze news', details: error.message });
  }
});

module.exports = router; 