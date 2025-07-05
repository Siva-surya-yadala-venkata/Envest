const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeHTTopStories() {
  const url = 'https://www.hindustantimes.com/india-news';
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
    $('.cartHolder, .listingPage .media').each((i, el) => {
      const headline = $(el).find('h3, h2, .hdg3').first().text().trim();
      const summary = $(el).find('p').first().text().trim();
      let image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      if (image && image.startsWith('//')) image = 'https:' + image;
      const link = $(el).find('a').first().attr('href');
      const time = $(el).find('span.time, .dateTime').first().text().trim();
      if (headline && link) {
        news.push({
          headline,
          summary,
          image,
          link: link.startsWith('http') ? link : `https://www.hindustantimes.com${link}`,
          time,
          category: 'Top Stories',
        });
      }
    });
    return news;
  } catch (err) {
    console.error('Error scraping Hindustan Times Top Stories:', err.message);
    return [];
  }
}

module.exports = scrapeHTTopStories; 