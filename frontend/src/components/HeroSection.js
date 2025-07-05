import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const FloatingSVG = ({ style, children }) => (
  <Box
    sx={{
      position: 'absolute',
      ...style,
      zIndex: 0,
      opacity: 0.7,
      animation: 'float 6s ease-in-out infinite alternate',
    }}
  >
    {children}
  </Box>
);

const HeroSection = () => (
  <Box
    sx={{
      minHeight: { xs: '50vh', md: '60vh' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
      position: 'relative',
      overflow: 'hidden',
      py: 8,
      mb: 4,
    }}
  >
    {/* Floating SVG shapes */}
    <FloatingSVG style={{ top: '10%', left: '5%' }}>
      <svg width="60" height="60"><circle cx="30" cy="30" r="30" fill="#2962ff" fillOpacity="0.15" /></svg>
    </FloatingSVG>
    <FloatingSVG style={{ top: '20%', right: '10%' }}>
      <svg width="80" height="80"><rect width="80" height="80" rx="20" fill="#00c6ff" fillOpacity="0.12" /></svg>
    </FloatingSVG>
    <FloatingSVG style={{ bottom: '10%', left: '20%' }}>
      <svg width="50" height="50"><ellipse cx="25" cy="25" rx="25" ry="15" fill="#43a047" fillOpacity="0.10" /></svg>
    </FloatingSVG>
    <FloatingSVG style={{ bottom: '15%', right: '15%' }}>
      <svg width="70" height="70"><polygon points="35,0 70,70 0,70" fill="#ffa000" fillOpacity="0.10" /></svg>
    </FloatingSVG>
    <Typography variant="h2" fontWeight={700} color="#1a237e" align="center" gutterBottom sx={{ zIndex: 1, mt: 4 }}>
      Smart News + <span style={{ color: '#2962ff' }}>Portfolio Insights</span>
    </Typography>
    <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 4, zIndex: 1 }}>
      Get personalized stock news and AI-powered insights for your portfolio. Stay ahead with real-time updates and smart analysis.
    </Typography>
    <Button variant="contained" size="large" sx={{ bgcolor: '#2962ff', borderRadius: 8, px: 5, py: 1.5, fontWeight: 600, zIndex: 1, boxShadow: 2 }}>
      Get Started
    </Button>
    {/* Floating animation keyframes */}
    <style>{`
      @keyframes float {
        0% { transform: translateY(0px); }
        100% { transform: translateY(-20px); }
      }
    `}</style>
  </Box>
);

export default HeroSection; 