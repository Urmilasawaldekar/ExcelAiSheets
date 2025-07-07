import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setMessage('Please enter both email and password.');
        return;
      }
      // Additional check to prevent multiple submissions
      if (e.nativeEvent.isTrusted === false) {
        return;
      }
      // Clear previous message before new login attempt
      setMessage('');
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Login successful!');
        // Redirect based on role or default to user dashboard
        if (data.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred during login.');
      console.error('Login error:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
    
     
      <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {message && (
          <Typography color={message === 'Login successful!' ? 'green' : 'error'} sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
