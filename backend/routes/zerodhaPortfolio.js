const express = require('express');
const KiteConnect = require('kiteconnect').KiteConnect;
const router = express.Router();

const KITE_API_KEY = process.env.KITE_API_KEY || 'nhjdq6i2k4gyvdwm';

// GET /api/zerodha/holdings?access_token=... - fetch portfolio holdings
router.get('/holdings', async (req, res) => {
  const { access_token } = req.query;
  if (!access_token) return res.status(400).json({ error: 'Missing access_token' });
  try {
    const kite = new KiteConnect({ api_key: KITE_API_KEY });
    kite.setAccessToken(access_token);
    const holdings = await kite.getHoldings();
    res.json({ holdings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch holdings', details: err.message });
  }
});

module.exports = router; 