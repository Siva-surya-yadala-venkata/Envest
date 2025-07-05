import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Link } from '@mui/material';

const Navbar = () => (
  <AppBar
    position="sticky"
    elevation={0}
    sx={{
      bgcolor: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '2px solid #e3f2fd',
      boxShadow: '0 2px 16px 0 rgba(41,98,255,0.07)',
      zIndex: 10,
    }}
  >
    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
      <Box display="flex" alignItems="center">
        <Box sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2962ff 60%, #00c6ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
          boxShadow: '0 2px 8px 0 #2962ff33',
        }}>
          <Typography variant="h5" fontWeight={900} sx={{ color: '#fff', letterSpacing: 1 }}>
            E
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={900} sx={{ color: '#1a237e', letterSpacing: 1 }}>
          nvest
        </Typography>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
        {['Home', 'IPO', 'IPO Allotment', 'Contact'].map((text) => (
          <Link
            key={text}
            href="#"
            underline="none"
            color="inherit"
            fontWeight={600}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              transition: 'background 0.2s',
              '&:hover': { background: 'rgba(41,98,255,0.08)', color: '#2962ff' }
            }}
          >
            {text}
          </Link>
        ))}
      </Box>
      <Button
        variant="contained"
        sx={{
          background: 'linear-gradient(90deg, #2962ff 60%, #00c6ff 100%)',
          borderRadius: 8,
          fontWeight: 700,
          px: 4,
          boxShadow: '0 2px 16px 0 #2962ff44',
          textTransform: 'none',
          fontSize: 16,
          filter: 'drop-shadow(0 0 8px #2962ff66)',
        }}
      >
        Get App
      </Button>
    </Toolbar>
  </AppBar>
);

export default Navbar; 