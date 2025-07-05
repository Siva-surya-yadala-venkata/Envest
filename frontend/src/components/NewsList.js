import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, ButtonGroup, CircularProgress } from '@mui/material';
import NewsCard from './NewsCard';

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'Top Stories', label: 'Top Stories' },
  { key: 'Stocks', label: 'Stocks' },
  { key: 'Futures', label: 'Futures' },
  { key: 'Forex', label: 'Forex' },
  { key: 'Crypto', label: 'Crypto' },
];

const NewsList = ({ portfolioSymbols, onFilteredNewsChange }) => {
  const [category, setCategory] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRelevantOnly, setShowRelevantOnly] = useState(false);
  const [filteredNews, setFilteredNews] = useState([]);

  const fetchNews = async () => {
    setLoading(true);
    let url = '/api/news';
    const params = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (params.length) url += '?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setNews(data.news || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [category]);

  // Filter news based on portfolio symbols when showRelevantOnly is true
  useEffect(() => {
    if (showRelevantOnly && portfolioSymbols && portfolioSymbols.length > 0) {
      const relevant = news.filter(item => {
        const title = (item.title || item.headline || '').toLowerCase();
        const summary = (item.summary || '').toLowerCase();
        return portfolioSymbols.some(symbol => {
          const symbolLower = symbol.toLowerCase();
          return title.includes(symbolLower) || summary.includes(symbolLower);
        });
      });
      setFilteredNews(relevant);
      // Pass filtered news to parent component
      if (onFilteredNewsChange) {
        onFilteredNewsChange(relevant);
      }
    } else {
      setFilteredNews(news);
      // Pass all news to parent component
      if (onFilteredNewsChange) {
        onFilteredNewsChange(news);
      }
    }
  }, [showRelevantOnly, news, portfolioSymbols, onFilteredNewsChange]);

  const toggleRelevantNews = () => {
    setShowRelevantOnly(!showRelevantOnly);
  };

  const displayNews = showRelevantOnly ? filteredNews : news;

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          News
        </Typography>
        {portfolioSymbols && portfolioSymbols.length > 0 && (
          <Button
            variant={showRelevantOnly ? 'contained' : 'outlined'}
            onClick={toggleRelevantNews}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            {showRelevantOnly ? 'Show All News' : 'Show Relevant News'}
          </Button>
        )}
      </Box>
      <ButtonGroup sx={{ mb: 2, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <Button
            key={cat.key}
            variant={category === cat.key ? 'contained' : 'outlined'}
            onClick={() => setCategory(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
        <Button onClick={fetchNews} disabled={loading}>Refresh</Button>
      </ButtonGroup>
      {loading ? <CircularProgress sx={{ my: 2 }} /> :
        displayNews.length === 0 ? (
          <Typography sx={{ my: 2 }}>
            {showRelevantOnly ? 'No portfolio-relevant news available.' : 'No news available.'}
          </Typography>
        ) :
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayNews.map((item, idx) => (
            <NewsCard
              key={idx}
              headline={item.headline || item.title}
              subtitle={item.summary}
              image={item.image}
              category={item.category}
              time={item.time}
              highlightWords={portfolioSymbols || []}
              link={item.link}
            />
          ))}
        </Box>
      }
    </Box>
  );
};

export default NewsList; 