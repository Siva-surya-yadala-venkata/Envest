const express = require('express');
const axios = require('axios');
const KiteConnect = require('kiteconnect').KiteConnect;
const router = express.Router();

const KITE_API_KEY = process.env.KITE_API_KEY || 'nhjdq6i2k4gyvdwm';
const KITE_API_SECRET = process.env.KITE_API_SECRET || 'YOUR_API_SECRET_HERE';
const REDIRECT_URL = process.env.KITE_REDIRECT_URL || 'http://localhost:3000';

// Step 1: Redirect user to Zerodha login
router.get('/login', (req, res) => {
  const loginUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${KITE_API_KEY}`;
  res.redirect(loginUrl);
});

// Step 2: Handle redirect from Zerodha with request_token
router.get('/callback', async (req, res) => {
  const { request_token } = req.query;
  if (!request_token) {
    return res.status(400).send('Missing request_token');
  }
  try {
    const kite = new KiteConnect({ api_key: KITE_API_KEY });
    const session = await kite.generateSession(request_token, KITE_API_SECRET);
    // Store access_token securely (in DB or session; here, just send as demo)
    // In production, never expose access_token to frontend!
    res.json({ access_token: session.access_token, user_id: session.user_id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate session', details: err.message });
  }
});

module.exports = router; 