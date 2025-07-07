import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Brand and Explore Link */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/listing" color="inherit" size="large" edge="start" aria-label="brand">
            <ExploreIcon sx={{ color: '#fe424d' }} />
          </IconButton>
          <Typography component={Link} to="/listings" variant="body1" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'medium' }}>
            Explore
          </Typography>
        </Box>

        {/* Search Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '25px',
            backgroundColor: '#fe424d',
            padding: '0.5rem 1rem',
            width: { xs: '100%', sm: 'auto' },
            maxWidth: 400,
          }}
        >
          <SearchIcon sx={{ color: '#fff', mr: 1, display: 'inline' }} />
          <InputBase
            placeholder="destination search-info"
            inputProps={{ 'aria-label': 'search' }}
            sx={{
              color: '#fff',
              fontSize: '0.8rem',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: 0,
              },
            }}
          />
        </Box>

        {/* Login and Register Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/login" variant="outlined" sx={{ color: '#fe424d', borderColor: '#fe424d', '&:hover': { backgroundColor: '#fe424d', color: '#fff' } }}>
            Login
          </Button>
          <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#fe424d', '&:hover': { backgroundColor: '#d93a3f' } }}>
            Register
          </Button>
      
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
