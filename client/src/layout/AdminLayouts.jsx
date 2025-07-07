import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const AdminLayouts = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Admin Dashboard', path: '/admindashboard' },
    { label: 'Users', path: '/users' },
  
  ];

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #ddd', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} component={Link} to="/admindashboard">
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', background: 'linear-gradient(to right, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ExcelAI Analytics
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{ color: 'text.primary', textTransform: 'none', fontWeight: 'medium', '&:hover': { color: '#3b82f6' } }}
                >
                  {item.label}
                </Button>
              ))}
              <Button variant="outlined" color="primary" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 3 }} onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }}>
                Logout
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Button onClick={() => setIsMenuOpen(!isMenuOpen)} sx={{ minWidth: 'auto', p: 1 }}>
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </Button>
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Box sx={{ display: { xs: 'block', md: 'none' }, bgcolor: '#fff', borderTop: '1px solid #ddd', px: 2, py: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                fullWidth
                component={Link}
                to={item.path}
                sx={{ justifyContent: 'flex-start', color: 'text.primary', textTransform: 'none', fontWeight: 'medium', mb: 1 }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Button>
            ))}
         <Button variant="outlined" color="primary" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 3 }} onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }}>
                Logout
              </Button>
          </Box>
        )}
      </AppBar>
      <Toolbar /> {/* To offset content below fixed AppBar */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default AdminLayouts;
