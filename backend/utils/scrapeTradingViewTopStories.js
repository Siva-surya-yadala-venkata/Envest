const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTradingViewTopStories() {
  const url = 'https://www.tradingview.com/news/markets/all/';
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
    const $ = cheerio.load(data);
    const news = [];
    // Each news item is in a .tv-widget-news__item or similar
    $('[data-widget-news-row]').each((i, el) => {
      const headline = $(el).find('a[data-widget-news-title]').text().trim();
      const link = $(el).find('a[data-widget-news-title]').attr('href');
      const summary = $(el).find('.tv-widget-news__text').text().trim();
      const image = $(el).find('img').attr('src');
      const time = $(el).find('time').text().trim();
      const symbols = [];
      $(el).find('.tv-widget-news__symbols span').each((j, sym) => {
        symbols.push($(sym).text().trim());
      });
      if (headline && link) {
        news.push({
          headline,
          summary,
          image,
          link: link.startsWith('http') ? link : `https://www.tradingview.com${link}`,
          time,
          symbols,
        });
      }
    });
    return news;
  } catch (err) {
    console.error('Error scraping TradingView Top Stories:', err.message);
    return [];
  }
}

module.exports = scrapeTradingViewTopStories; 