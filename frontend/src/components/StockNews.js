import React from 'react';
import NewsList from './NewsList';

const StockNews = ({ symbol }) => {
  // Pass the symbol as portfolioSymbols to NewsList for relevant news
  return <NewsList portfolioSymbols={symbol ? [symbol] : []} />;
};

export default StockNews; 