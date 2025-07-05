const express = require('express');
const axios = require('axios');
const router = express.Router();

const FMP_API_KEY = process.env.FMP_API_KEY || 'YOUR_FMP_API_KEY'; // Set your FMP API key in .env

// GET /api/stock-history/:symbol - fetch historical price data for a symbol
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${FMP_API_KEY}`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

module.exports = router; 