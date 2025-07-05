const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');

// Load environment variables
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Import routes
const newsRoutes = require('./routes/news');
const { router: portfolioRoutes } = require('./routes/portfolio');
const filteredNewsRoutes = require('./routes/filteredNews');
const analyzeRoutes = require('./routes/analyze');
const stockHistoryRoutes = require('./routes/stockHistory');
const zerodhaAuthRoutes = require('./routes/zerodhaAuth');
const zerodhaPortfolioRoutes = require('./routes/zerodhaPortfolio');
const authRouter = require('./routes/auth');

// Use routes
app.use('/api/news', newsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/filtered-news', filteredNewsRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/stock-history', stockHistoryRoutes);
app.use('/api/zerodha', zerodhaAuthRoutes);
app.use('/api/zerodha', zerodhaPortfolioRoutes);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 