import React, { useState } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';

const FMP_API_KEY = process.env.REACT_APP_FMP_API_KEY;
console.log('FMP_API_KEY in SymbolSearch:', FMP_API_KEY);

const SymbolSearch = ({ onSelect }) => {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (event, value) => {
    setInput(value);
    if (value.length < 2) return;
    setLoading(true);
    const res = await fetch(`https://financialmodelingprep.com/stable/search-symbol?query=${value}&apikey=${FMP_API_KEY}`);
    let data = await res.json();
    if (!Array.isArray(data)) data = [];
    setOptions(data);
    setLoading(false);
  };

  return (
    <Autocomplete
      freeSolo
      options={Array.isArray(options) ? options : []}
      getOptionLabel={option => option.symbol + ' - ' + option.name}
      onInputChange={handleInputChange}
      onChange={(e, value) => value && onSelect(value.symbol)}
      loading={loading}
      renderInput={params => (
        <TextField {...params} label="Search Symbol" variant="outlined" size="small" InputProps={{ ...params.InputProps, endAdornment: loading ? <CircularProgress color="inherit" size={20} /> : null }} />
      )}
      sx={{ minWidth: 250 }}
    />
  );
};

export default SymbolSearch; 