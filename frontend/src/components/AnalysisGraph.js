import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FMP_API_KEY = process.env.REACT_APP_FMP_API_KEY;
console.log('FMP_API_KEY in AnalysisGraph:', FMP_API_KEY);

const colors = {
  'NSEI': '#4f46e5',
  'TCS.NS': '#06b6d4',
  'INFY.NS': '#f59e42',
  'RELIANCE.NS': '#43a047',
};

const AnalysisGraph = ({ symbol: propSymbol }) => {
  const [symbol, setSymbol] = useState(propSymbol || 'AAPL');
  const [inputSymbol, setInputSymbol] = useState(propSymbol || 'AAPL');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propSymbol) {
      setSymbol(propSymbol);
      setInputSymbol(propSymbol);
    }
  }, [propSymbol]);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError('');
    setData([]);
    fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${FMP_API_KEY}`)
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.historical && resData.historical.length > 0) {
          setData(resData.historical.slice(-90).reverse().map(item => ({ date: item.date, close: item.close })));
        } else {
          setData([]);
          setError('No data available for this symbol.');
        }
      })
      .catch(() => {
        setData([]);
        setError('Failed to fetch data.');
      })
      .finally(() => setLoading(false));
  }, [symbol]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSymbol(inputSymbol.trim().toUpperCase());
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          Stock Price Over Time
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <TextField
            size="small"
            label="Symbol"
            value={inputSymbol}
            onChange={e => setInputSymbol(e.target.value)}
            placeholder="e.g. JIOFIN.NS, TCS.NS, AAPL"
            sx={{ minWidth: 140 }}
          />
          <Button type="submit" variant="contained" sx={{ bgcolor: '#2962ff', fontWeight: 600 }}>
            Show
          </Button>
        </form>
      </Box>
      {loading ? (
        <Typography sx={{ color: '#888', my: 4 }}>Loading chart...</Typography>
      ) : error ? (
        <Typography color="error" sx={{ my: 4 }}>{error}</Typography>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={20} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="close" stroke={colors[symbol] || '#4f46e5'} strokeWidth={3} dot={false} name={symbol} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography sx={{ color: '#888', my: 4 }}>No data available for this symbol.</Typography>
      )}
    </Paper>
  );
};

export default AnalysisGraph; 