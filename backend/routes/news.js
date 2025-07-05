const express = require('express');
const router = express.Router();
const scrapeNews = require('../utils/scrapeNews');
const scrapeTopStories = require('../utils/scrapeTopStories');
const scrapeHTTopStories = require('../utils/scrapeHTTopStories');
const scrapeHTAll = require('../utils/scrapeHTAll');
const { router: portfolioRouter } = require('./portfolio');
const axios = require('axios');
const cheerio = require('cheerio');
const scrapeTOITopStories = require('../utils/scrapeTOITopStories');
const scrapeTOIAll = require('../utils/scrapeTOIAll');
const scrapeTradingViewTopStories = require('../utils/scrapeTradingViewTopStories');

// GET /api/news - fetch news, support category and portfolio filtering
router.get('/', async (req, res) => {
  try {
    const { category, portfolio } = req.query;
    let news;
    if (category && (category.toLowerCase() === 'top stories' || category.toLowerCase() === 'all')) {
      news = await scrapeTopStories();
    } else {
      news = await scrapeNews(category);
      if (category) {
        news = news.filter(n => n.category && n.category.toLowerCase() === category.toLowerCase());
      }
    }
    if (portfolio) {
      const symbols = portfolio.split(',').map(s => s.trim().toUpperCase());
      news = news.filter(n =>
        symbols.some(sym =>
          (n.title?.toUpperCase().includes(sym) || n.headline?.toUpperCase().includes(sym)) ||
          (n.summary?.toUpperCase().includes(sym))
        )
      );
    }
    res.json({ news });
  } catch (error) {
    console.error('Error in /api/news:', error);
    try {
      res.status(500).json({ error: 'Failed to fetch news', details: error.message });
    } catch (jsonErr) {
      console.error('Failed to send JSON error response:', jsonErr);
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({ error: 'Critical backend error', details: jsonErr.message }));
    }
  }
});

// GET /api/news/tradingview - Scrape TradingView for Community Ideas and Top Stories
router.get('/tradingview', async (req, res) => {
  try {
    const url = 'https://www.tradingview.com/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const communityIdeas = [];
    const topStories = [];

    // Scrape Community Ideas (cards with images)
    $("section:contains('Community ideas')").find('article').each((i, el) => {
      const img = $(el).find('img').attr('src');
      const title = $(el).find('h3, h2').first().text().trim();
      const summary = $(el).find('p').first().text().trim();
      const link = $(el).find('a').first().attr('href');
      if (title && link) {
        communityIdeas.push({
          img,
          title,
          summary,
          link: link.startsWith('http') ? link : `https://www.tradingview.com${link}`
        });
      }
    });

    // Scrape Top Stories (text news)
    $("section:contains('Top stories')").find('li, div[role="listitem"]').each((i, el) => {
      const title = $(el).find('a, span').first().text().trim();
      const link = $(el).find('a').first().attr('href');
      const summary = $(el).find('span, p').eq(1).text().trim();
      if (title && link) {
        topStories.push({
          title,
          summary,
          link: link.startsWith('http') ? link : `https://www.tradingview.com${link}`
        });
      }
    });

    res.json({ communityIdeas, topStories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch TradingView news.' });
  }
});

// NEW: /api/ht-topstories for Hindustan Times India News
router.get('/ht-topstories', async (req, res) => {
  try {
    const news = await scrapeHTTopStories();
    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HT Top Stories' });
  }
});

// NEW: /api/ht-all for Hindustan Times homepage
router.get('/ht-all', async (req, res) => {
  try {
    const news = await scrapeHTAll();
    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HT All News' });
  }
});

// NEW: /api/news/toi-topstories for Times of India Top Stories
router.get('/toi-topstories', async (req, res) => {
  try {
    const news = await scrapeTOITopStories();
    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch TOI Top Stories' });
  }
});

// NEW: /api/news/toi-all for Times of India homepage
router.get('/toi-all', async (req, res) => {
  try {
    const news = await scrapeTOIAll();
    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch TOI All News' });
  }
});

module.exports = router; 