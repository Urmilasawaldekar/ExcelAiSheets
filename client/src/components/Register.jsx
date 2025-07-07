import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Registration successful!');
        // Redirect to login page after successful registration
        navigate('/login');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('An error occurred during registration.');
      console.error('Registration error:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
       
       
      </Box>
      <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        {message && (
          <Typography color={message === 'Registration successful!' ? 'green' : 'error'} sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
