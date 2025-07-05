import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Grid, Card, CardContent, IconButton, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import InsightsIcon from '@mui/icons-material/Insights';
import SymbolSearch from './components/SymbolSearch';
import StockProfile from './components/StockProfile';
import StockNews from './components/StockNews';
import StockArticles from './components/StockArticles';
import StockRatings from './components/StockRatings';
import AnalysisGraph from './components/AnalysisGraph';
import NewsList from './components/NewsList';
import PortfolioInput from './components/PortfolioInput';
import FilteredNews from './components/FilteredNews';
import AnalysisSummary from './components/AnalysisSummary';
import LoginSignup from './components/LoginSignup';
import './App.css';
import LogoutIcon from '@mui/icons-material/Logout';

// Add custom styles for animations
const customStyles = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

const drawerWidth = 220;
const sections = [
  { label: 'Dashboard', icon: <DashboardIcon /> },
  { label: 'Portfolio', icon: <ListAltIcon /> },
  { label: 'News', icon: <NewspaperIcon /> },
  { label: 'Analysis', icon: <InsightsIcon /> },
];

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';
const FMP_API_KEY = process.env.REACT_APP_FMP_API_KEY;

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [profile, setProfile] = useState(null);
  const [priceStats, setPriceStats] = useState({ price: null, change: null, volume: null, high: null, low: null });
  const [selected, setSelected] = useState('Dashboard');
  const [portfolio, setPortfolio] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [filteredLoading, setFilteredLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch profile and price stats for the selected symbol
  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${FMP_API_KEY}`);
      const data = await res.json();
      setProfile(data[0]);
    }
    async function fetchQuote() {
      const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`);
      const data = await res.json();
      if (data && data[0]) {
        setPriceStats({
          price: data[0].price,
          change: data[0].changesPercentage,
          volume: data[0].volume,
          high: data[0].dayHigh,
          low: data[0].dayLow
        });
      }
    }
    fetchProfile();
    fetchQuote();
  }, [symbol]);



  // Fetch portfolio for logged-in user
  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE}/portfolio/${user.id || user.email}`)
        .then(res => setPortfolio(res.data.portfolio))
        .catch(() => setPortfolio([]));
      setFilteredNews([]);
      setAnalysis('');
      setAnalysisLoading(false);
    }
  }, [user]);

  // Check for token/user on mount
  useEffect(() => {
    // Check for Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Handle Google OAuth callback
      localStorage.setItem('token', token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Get user info with the token
      axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    } else {
      // Check for existing token
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${existingToken}` } })
          .then(res => setUser(res.data))
          .catch(() => localStorage.removeItem('token'));
      }
    }
  }, []);

  // Handler to save portfolio
  const handleSavePortfolio = (userId, symbols) => {
    axios.post(`${API_BASE}/portfolio`, { userId, symbols })
      .then(res => {
        setPortfolio(res.data.portfolio);
      })
      .catch(() => alert('Failed to save portfolio.'));
  };

  // Handler to analyze news
  const handleAnalyze = () => {
    if (!filteredNews.length || !portfolio.length) return;
    setAnalysisLoading(true);
    
    // Extract headlines and summaries from news objects
    const newsData = filteredNews.map(item => ({
      headline: item.headline || item.title || '',
      summary: item.summary || ''
    }));
    
    axios.post(`${API_BASE}/analyze`, { headlines: newsData, symbols: portfolio })
      .then(res => setAnalysis(res.data.analysis))
      .catch((error) => {
        console.error('Analysis error:', error);
        setAnalysis(`Analysis failed: ${error.response?.data?.error || error.message || 'Unknown error'}`);
      })
      .finally(() => setAnalysisLoading(false));
  };

  const handleAuth = (user) => {
    setUser(user);
    setSelected('Dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSelected('Dashboard');
  };

  if (!user) {
    return <LoginSignup onAuth={handleAuth} />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f7faff 0%, #e0e7ff 100%)', pb: 6 }}>
      <CssBaseline />
      {/* Modern Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            borderRight: 'none',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              pointerEvents: 'none',
            }
          },
        }}
      >
        {/* Logo Section */}
        <Box sx={{ 
          p: 3, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Typography 
            variant="h4" 
            fontWeight={900} 
            sx={{ 
              background: 'linear-gradient(45deg, #00d4ff, #4f46e5, #7c3aed)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 2,
              textShadow: '0 2px 10px rgba(79, 70, 229, 0.3)'
            }}
          >
            ENVEST
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>
            INVESTMENT INTELLIGENCE
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ p: 2, mt: 2 }}>
          {sections.map((section, index) => (
            <Box
              key={section.label}
              onClick={() => setSelected(section.label)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                mb: 1,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideIn 0.5s ease ${index * 0.1}s both`,
                background: selected === section.label 
                  ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)'
                  : 'transparent',
                border: selected === section.label 
                  ? '1px solid rgba(79, 70, 229, 0.3)'
                  : '1px solid transparent',
                '&:hover': {
                  background: selected === section.label 
                    ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  transform: 'translateX(4px)',
                  boxShadow: selected === section.label 
                    ? '0 4px 20px rgba(79, 70, 229, 0.3)'
                    : '0 2px 10px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: selected === section.label 
                  ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                transition: 'all 0.3s ease'
              }}>
                {section.icon}
              </Box>
              <Typography 
                sx={{ 
                  color: '#a5b4fc',
                  textShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  fontWeight: selected === section.label ? 700 : 500,
                  fontSize: '0.95rem',
                  letterSpacing: 0.5
                }}
              >
                {section.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* User Profile Section */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: 2,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.2)'
              }} 
              src={user?.avatar}
            >
              {user?.name?.[0] || 'E'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user?.name || 'User'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem'
                }}
              >
                Premium Member
              </Typography>
            </Box>
            <IconButton 
              onClick={handleLogout}
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                '&:hover': { 
                  color: '#ff4757',
                  background: 'rgba(255, 71, 87, 0.1)'
                }
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, md: 4 }, ml: { md: `${drawerWidth}px` } }}>
        {/* Modern Top Bar */}
        <Box sx={{ 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          mx: 2,
          mt: 2,
          mb: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
              }}>
                {sections.find(s => s.label === selected)?.icon}
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight={800} 
                  sx={{ 
                    background: 'linear-gradient(45deg, #1a1a2e, #4f46e5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: 1
                  }}
                >
                  {selected}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    letterSpacing: 0.5
                  }}
                >
                  {selected === 'Dashboard' && 'Monitor your investments and market trends'}
                  {selected === 'Portfolio' && 'Manage your investment portfolio'}
                  {selected === 'News' && 'Stay updated with market news and insights'}
                  {selected === 'Analysis' && 'AI-powered market analysis and insights'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(79, 70, 229, 0.05)',
                border: '1px solid rgba(79, 70, 229, 0.1)'
              }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite'
                }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  Live Market
                </Typography>
              </Box>
              {/* Logout button in top bar */}
              <IconButton 
                onClick={handleLogout}
                sx={{ 
                  ml: 2,
                  color: '#e53935',
                  background: 'rgba(229,57,53,0.08)',
                  borderRadius: 2,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(229,57,53,0.18)',
                    color: '#fff',
                  }
                }}
                aria-label="Logout"
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        {/* Main Content */}
        {selected === 'Dashboard' && (
          <Grid container columns={12} spacing={4} sx={{ maxWidth: 1400, mx: 'auto', mt: 2 }}>
            {/* Left/Main Column */}
            <Grid sx={{ gridColumn: 'span 8' }}>
              {/* Search Bar */}
              <Card sx={{ mb: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(255,255,255,0.95)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SearchIcon sx={{ color: '#bdbdbd' }} />
                  <SymbolSearch onSelect={setSymbol} />
                </CardContent>
              </Card>
              {/* Stock Summary Card */}
              <Card sx={{ mb: 3, borderRadius: 4, boxShadow: 2, background: 'linear-gradient(90deg, #f1f5ff 60%, #f7faff 100%)' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{symbol}</Typography>
                      <Typography variant="body2" color="text.secondary">{profile?.companyName}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h4" fontWeight={800} color="#178545">
                        {priceStats.price !== null ? `$${priceStats.price}` : '--'}
                      </Typography>
                      <Typography variant="subtitle2" color={priceStats.change > 0 ? '#178545' : '#e53935'}>
                        {priceStats.change !== null ? `${priceStats.change > 0 ? '+' : ''}${priceStats.change.toFixed(2)}%` : ''}
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container columns={12} spacing={2}>
                    <Grid sx={{ gridColumn: 'span 4' }}>
                      <Box sx={{ background: '#fff', borderRadius: 2, p: 2, textAlign: 'center', boxShadow: 1 }}>
                        <Typography variant="caption" color="text.secondary">Volume</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{priceStats.volume ? (priceStats.volume/1e6).toFixed(1) + 'M' : '--'}</Typography>
                      </Box>
                    </Grid>
                    <Grid sx={{ gridColumn: 'span 4' }}>
                      <Box sx={{ background: '#fff', borderRadius: 2, p: 2, textAlign: 'center', boxShadow: 1 }}>
                        <Typography variant="caption" color="text.secondary">High</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{priceStats.high !== null ? `$${priceStats.high}` : '--'}</Typography>
                      </Box>
                    </Grid>
                    <Grid sx={{ gridColumn: 'span 4' }}>
                      <Box sx={{ background: '#fff', borderRadius: 2, p: 2, textAlign: 'center', boxShadow: 1 }}>
                        <Typography variant="caption" color="text.secondary">Low</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{priceStats.low !== null ? `$${priceStats.low}` : '--'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              {/* Price Chart Card */}
              <Card sx={{ mb: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(255,255,255,0.95)' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Price Chart</Typography>
                  <AnalysisGraph symbol={symbol} />
                </CardContent>
              </Card>
              {/* Ratings Card */}
              <Card sx={{ mb: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(255,255,255,0.95)' }}>
                <CardContent>
                  <StockRatings symbol={symbol} />
                </CardContent>
              </Card>
            </Grid>
            {/* Right Sidebar */}
            <Grid sx={{ gridColumn: 'span 4' }}>
              <Card sx={{ borderRadius: 4, boxShadow: 2, background: 'rgba(255,255,255,0.95)' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recommended Articles</Typography>
                  <StockArticles />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {selected === 'Portfolio' && (
          <PortfolioInput onSave={handleSavePortfolio} currentPortfolio={portfolio} user={user} />
        )}
        {selected === 'News' && (
          <NewsList 
            portfolioSymbols={portfolio} 
            onFilteredNewsChange={(news) => setFilteredNews(news)}
          />
        )}
        {selected === 'Analysis' && (
          <>
            <FilteredNews
              filteredNews={filteredNews}
              loading={filteredLoading}
              onAnalyze={handleAnalyze}
            />
            <AnalysisSummary analysis={analysis} loading={analysisLoading} />
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;


 