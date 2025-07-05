import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Link } from '@mui/material';

const FMP_API_KEY = process.env.REACT_APP_FMP_API_KEY;
console.log('FMP_API_KEY in StockArticles:', FMP_API_KEY);

const StockArticles = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetch(`https://financialmodelingprep.com/stable/fmp-articles?page=0&limit=20&apikey=${FMP_API_KEY}`)
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(() => setArticles([]));
  }, []);

  if (!articles.length) return null;
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>FMP Articles</Typography>
      {articles.map((item, idx) => (
        <Box key={idx} sx={{ mb: 1.5 }}>
          <Link href={item.url} target="_blank" rel="noopener" underline="hover">
            <Typography variant="subtitle2">{item.title}</Typography>
          </Link>
          <Typography variant="body2" color="text.secondary">{item.summary}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default StockArticles; 