import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';

const FMP_API_KEY = process.env.REACT_APP_FMP_API_KEY;
console.log('FMP_API_KEY in StockRatings:', FMP_API_KEY);

const StockRatings = ({ symbol }) => {
  const [ratings, setRatings] = useState(null);
  useEffect(() => {
    if (!symbol) return;
    fetch(`https://financialmodelingprep.com/stable/ratings-snapshot?symbol=${symbol}&apikey=${FMP_API_KEY}`)
      .then(res => res.json())
      .then(data => setRatings(data[0]))
      .catch(() => setRatings(null));
  }, [symbol]);

  if (!ratings) return null;
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Ratings Snapshot</Typography>
      <Typography variant="subtitle1">{ratings.rating} ({ratings.ratingScore})</Typography>
      <Typography variant="body2" color="text.secondary">{ratings.ratingRecommendation}</Typography>
      {ratings.ratingDetails && (
        <Box sx={{ mt: 1 }}>
          {Object.entries(ratings.ratingDetails).map(([key, value]) => (
            <Typography key={key} variant="body2">{key}: {value}</Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default StockRatings; 