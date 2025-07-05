const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTopStories() {
  const url = 'https://www.tradingview.com/ideas/top/';
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });
    // Optionally log a preview for debugging
    // console.log('Moneycontrol HTML preview:', data.slice(0, 500));
    const $ = cheerio.load(data);
    const news = [];
    // Use the same logic as for other TradingView idea pages
    $('article.idea-card-R05xWTMw').each((i, el) => {
      const titleEl = $(el).find('a.title-tkslJwxl').first();
      const summaryEl = $(el).find('a.paragraph-t3qFZvNN span.line-clamp-content-t3qFZvNN').first();
      const imageEl = $(el).find('a.image-link-gDIex6UB img').first();
      const timeEl = $(el).find('time.publication-date-CgENjecZ').first();
      const title = titleEl.text().trim();
      const summary = summaryEl.text().trim();
      const image = imageEl.attr('src');
      const link = titleEl.attr('href');
      const time = timeEl.text().trim();
      if (title && link) {
        news.push({
          title,
          summary,
          image,
          link: link.startsWith('http') ? link : `https://www.tradingview.com${link}`,
          category: 'Top Stories',
          time
        });
      }
    });
    if (news.length === 0) {
      console.error('TradingView Top Ideas: No news found. Selector may be wrong or site structure changed.');
    }
    return news;
  } catch (err) {
    console.error('Error scraping TradingView Top Ideas:', err.message);
    return [];
  }
}

module.exports = scrapeTopStories; 