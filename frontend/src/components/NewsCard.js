import React from 'react';
import { Card, CardContent, Typography, Box, CardMedia, Chip } from '@mui/material';

const DEFAULT_IMAGE = 'https://s3.tradingview.com/userpics/og_image.png'; // TradingView default/og image

function highlightText(text, words) {
  if (!words || words.length === 0) return text;
  // Create a regex to match any of the highlight words (case-insensitive)
  const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    words.some(word => part.toLowerCase() === word.toLowerCase()) ? (
      <span key={i} style={{ background: '#e3f2fd', color: '#2962ff', fontWeight: 700 }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const NewsCard = ({ headline, highlightWords = [], subtitle, image, category, time }) => {
  const showImage = image || DEFAULT_IMAGE;
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 1,
        width: '100%',
        borderLeft: '6px solid #2962ff',
        bgcolor: '#fafcff',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 }
      }}
    >
      {showImage && (
        <CardMedia
          component="img"
          height="180"
          image={image || DEFAULT_IMAGE}
          alt={headline}
          sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {category && <Chip label={category} size="small" color="primary" />}
          {time && <Typography variant="caption" color="text.secondary">{time}</Typography>}
        </Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: 16, sm: 18 }, mb: 1 }}>
          {highlightText(headline, highlightWords)}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard; 