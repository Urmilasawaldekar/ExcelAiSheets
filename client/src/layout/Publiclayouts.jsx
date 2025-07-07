import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const PublicLayouts = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = ['Features', 'About'];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.toLowerCase());
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #ddd', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} component={Link} to="/">
              <BarChartIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', background: 'linear-gradient(to right, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ExcelAI Analytics
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  sx={{ color: 'text.primary', textTransform: 'none', fontWeight: 'medium', '&:hover': { color: '#3b82f6' } }}
                >
                  {item}
                </Button>
              ))}
              <Button variant="outlined" color="primary" component={Link} to="/login" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 3 }}>
                Login
              </Button>
              <Button variant="contained" color="primary" component={Link} to="/register" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 3 }}>
                Register
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
                key={item}
                fullWidth
                onClick={() => scrollToSection(item)}
                sx={{ justifyContent: 'flex-start', color: 'text.primary', textTransform: 'none', fontWeight: 'medium', mb: 1 }}
              >
                {item}
              </Button>
            ))}
            <Button fullWidth variant="outlined" color="primary" component={Link} to="/login" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 3, mb: 1 }}>
              Login
            </Button>
            <Button fullWidth variant="contained" color="primary" component={Link} to="/register" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 3 }}>
              Register
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

export default PublicLayouts;
