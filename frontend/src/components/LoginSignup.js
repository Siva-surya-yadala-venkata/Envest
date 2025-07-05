import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Tabs, Tab, Avatar, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
// Base path for all auth endpoints
const API_BASE = `${BACKEND_URL}/api/auth`;

const LoginSignup = ({ onAuth }) => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = tab === 0 ? `${API_BASE}/login` : `${API_BASE}/signup`;
      const payload = tab === 0 ? { email: form.email, password: form.password } : form;
      const res = await axios.post(url, payload);
      localStorage.setItem('token', res.data.token);
      if (onAuth) onAuth(res.data.user);
    } catch (err) {
      const msg = err.response?.data?.error || 'Authentication failed.';
      setError(msg);
      if (tab === 1 && msg.toLowerCase().includes('already registered')) {
        setTab(0); // Switch to Login tab
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f7faff 0%, #e0e7ff 100%)' }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, borderRadius: 4, boxShadow: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#4f46e5', width: 56, height: 56, mb: 1 }}>E</Avatar>
            <Typography variant="h5" fontWeight={800} color="#4f46e5">Envest</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Sign in to your account</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            )}
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }} disabled={loading}>
              {tab === 0 ? 'Login' : 'Sign Up'}
            </Button>
          </form>
          <Button onClick={handleGoogle} variant="outlined" color="primary" fullWidth startIcon={<GoogleIcon />} sx={{ mb: 1 }}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginSignup; 