import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Avatar, Link, Chip, Stack } from '@mui/material';

const TradingViewNewsTable = ({ endpoint, title }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setNews(data.news || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load news.');
        setLoading(false);
      });
    const interval = setInterval(() => {
      fetch(endpoint)
        .then(res => res.json())
        .then(data => setNews(data.news || []));
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [endpoint]);

  return (
    <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h6" fontWeight={700} sx={{ p: 2 }}>{title}</Typography>
      {loading ? (
        <CircularProgress sx={{ m: 4 }} />
      ) : error ? (
        <Typography color="error" sx={{ m: 4 }}>{error}</Typography>
      ) : news.length === 0 ? (
        <Typography sx={{ m: 4 }}>No news available.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Headline</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Symbols</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {news.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {item.image ? (
                    <Avatar variant="rounded" src={item.image} alt={item.headline} sx={{ width: 72, height: 72 }} />
                  ) : null}
                </TableCell>
                <TableCell>
                  <Link href={item.link} target="_blank" rel="noopener" underline="hover">
                    <Typography fontWeight={700}>{item.headline}</Typography>
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{item.summary}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {item.symbols && item.symbols.map((sym, i) => (
                      <Chip key={i} label={sym} size="small" />
                    ))}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default TradingViewNewsTable; 