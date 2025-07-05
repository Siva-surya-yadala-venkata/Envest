import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Avatar } from '@mui/material';

const FMP_API_KEY = process.env.REACT_APP_FMP_API_KEY;
console.log('FMP_API_KEY in StockProfile:', FMP_API_KEY);

const StockProfile = ({ symbol }) => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!symbol) return;
    fetch(`https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${FMP_API_KEY}`)
      .then(res => res.json())
      .then(data => setProfile(data[0]))
      .catch(() => setProfile(null));
  }, [symbol]);

  if (!profile) return null;
  return (
    <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar src={profile.image} alt={profile.companyName} sx={{ width: 56, height: 56 }} />
      <Box>
        <Typography variant="h6">{profile.companyName} ({profile.symbol})</Typography>
        <Typography variant="body2" color="text.secondary">{profile.sector} | {profile.industry}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>{profile.description}</Typography>
      </Box>
    </Paper>
  );
};

export default StockProfile; 