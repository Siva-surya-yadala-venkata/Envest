import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Box, Paper, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PortfolioInput = ({ onSave, currentPortfolio, user }) => {
  const [symbol, setSymbol] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = symbol.trim();
    if (!trimmed) return;
    if (currentPortfolio.includes(trimmed.toUpperCase())) return;
    const updated = [...currentPortfolio, trimmed.toUpperCase()];
    onSave(user.id || user.email, updated);
    setSymbol('');
  };

  const handleDelete = (idx) => {
    const updated = currentPortfolio.filter((_, i) => i !== idx);
    onSave(user.id || user.email, updated);
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setEditValue(currentPortfolio[idx]);
  };

  const handleEditSave = (idx) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const updated = [...currentPortfolio];
    updated[idx] = trimmed.toUpperCase();
    onSave(user.id || user.email, updated);
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {user?.name ? `${user.name}'s Portfolio` : 'Portfolio Input'}
      </Typography>
      <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Add stock symbol"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
          required
        />
        <Button type="submit" variant="contained" sx={{ bgcolor: '#2962ff', borderRadius: 2, fontWeight: 600, px: 4 }}>
          Add
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      {currentPortfolio && currentPortfolio.length > 0 && (
        <Box>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary" gutterBottom>
            Current Portfolio:
          </Typography>
          <List dense>
            {currentPortfolio.map((s, idx) => (
              <ListItem key={idx} secondaryAction={
                <>
                  {editingIndex === idx ? (
                    <>
                      <TextField
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        size="small"
                        sx={{ minWidth: 80, mr: 1 }}
                      />
                      <Button onClick={() => handleEditSave(idx)} size="small" variant="contained" sx={{ mr: 1 }}>Save</Button>
                      <Button onClick={() => setEditingIndex(null)} size="small" variant="outlined">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(idx)} size="small"><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(idx)} size="small" color="error"><DeleteIcon /></IconButton>
                    </>
                  )}
                </>
              }>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                {editingIndex === idx ? null : <ListItemText primary={s} />}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default PortfolioInput; 