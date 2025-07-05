const axios = require('axios');
const cheerio = require('cheerio');

const CATEGORIES = [
  { key: 'top-stories', url: 'https://www.tradingview.com/ideas/top/', label: 'Top Stories' },
  { key: 'stocks', url: 'https://www.tradingview.com/ideas/stocks/', label: 'Stocks' },
  { key: 'crypto', url: 'https://www.tradingview.com/ideas/crypto/', label: 'Crypto' },
  { key: 'futures', url: 'https://www.tradingview.com/ideas/futures/', label: 'Futures' },
  { key: 'forex', url: 'https://www.tradingview.com/ideas/forex/', label: 'Forex' },
];

async function scrapeTradingViewCategory(category) {
  const { url, label, key } = category;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const news = [];
    const unwantedTitles = [
      'Products', 'Community', 'Markets', 'Brokers', 'More', '/', 'Supercharts', 'ETFs', 'Bonds', 'Crypto coins', 'CEX pairs', 'DEX pairs',
      'Pine', 'Economic', 'Earnings', 'Dividends', 'Yield Curves', 'Options', 'News Flow', 'Pine Script®', 'Mobile', 'Desktop',
      'Social network', 'Wall of Love', 'Refer a friend', 'House Rules', 'Moderators', 'Trading', 'Education', "Editors' picks",
      'Indicators & strategies', 'Wizards', 'Freelancers', 'Features', 'Pricing', 'Market data', 'Overview', 'CME Group futures',
      'Eurex futures', 'US stocks bundle', 'Who we are', 'Manifesto', 'Athletes', 'Blog', 'Careers', 'Media kit', 'TradingView store',
      'Tarot cards for traders', 'The C63 TradeTime', 'Terms of Use', 'Disclaimer', 'Privacy Policy', 'Cookies Policy',
      'Accessibility Statement', 'Security tips', 'Bug Bounty program', 'Status page', 'Widgets', 'Charting libraries',
      'Lightweight Charts™', 'Advanced Charts', 'Trading Platform', 'Advertising', 'Brokerage integration', 'Partner program',
      'Education program', 'Stocks','Crypto'
    ];
    function isUnwantedTitle(title) {
      return unwantedTitles.some(unwanted =>
        title.trim().toLowerCase() === unwanted.toLowerCase()
      );
    }
    if (key === 'stocks' || key === 'futures' || key === 'crypto' || key === 'forex') {
      $('article.idea-card-R05xWTMw').each((i, el) => {
        const titleEl = $(el).find('a.title-tkslJwxl').first();
        const summaryEl = $(el).find('a.paragraph-t3qFZvNN span.line-clamp-content-t3qFZvNN').first();
        const imageEl = $(el).find('a.image-link-gDIex6UB img').first();
        let time = $(el).find('time.publication-date-CgENjecZ').first().text().trim();
        if (!time) {
          time = $(el).find('time').first().text().trim();
        }
        const title = titleEl.text().trim();
        const summary = summaryEl.text().trim();
        const image = imageEl.attr('src');
        const link = titleEl.attr('href');
        if (title && link && !isUnwantedTitle(title)) {
          news.push({
            title,
            summary,
            image,
            link: link.startsWith('http') ? link : `https://www.tradingview.com${link}`,
            category: label,
            time
          });
        }
      });
    } else {
      $("article, li, div[role='listitem']").each((i, el) => {
        const title = $(el).find('h3, h2, a, span').first().text().trim();
        const summary = $(el).find('p, span').eq(1).text().trim();
        const image = $(el).find('img').attr('src');
        const link = $(el).find('a').first().attr('href');
        let time = $(el).find('time').first().text().trim();
        if (title && link && !isUnwantedTitle(title)) {
          news.push({
            title,
            summary,
            image,
            link: link.startsWith('http') ? link : `https://www.tradingview.com${link}`,
            category: label,
            time
          });
        }
      });
    }
    return news;
  } catch (err) {
    console.error('Error scraping TradingView', label, err.message);
    return [];
  }
}

async function scrapeNews() {
  const allNews = await Promise.all(CATEGORIES.map(scrapeTradingViewCategory));
  // Flatten and deduplicate by title+link
  const flat = [].concat(...allNews);
  const seen = new Set();
  const deduped = flat.filter(n => {
    const key = n.title + n.link;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return deduped;
}

module.exports = scrapeNews; 