import React from 'react';
import { Box, Button, Typography, Grid, Stack, Card } from '@mui/material';
import { Link } from 'react-router-dom';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AboutUs from './AboutUs';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';

export default function Home() {
  return (
    <>
      <Box
        sx={{
          height: '70vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          p: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid container sx={{ maxWidth: 1200, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 3, p: 3 }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          </Grid>
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: 4, alignItems: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
              Welcome to Excel Analytics
            </Typography>
            <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Analyze your Excel data with powerful visualizations and easy-to-use tools.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" component={Link} to="/login">
                Login
              </Button>
              <Button variant="outlined" component={Link} to="/register">
                Register
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <FeaturesSection />
      <Box sx={{ mt: 6, mx: 'auto', maxWidth: 1200 }}>
        <AboutUs />
      </Box>
      <Box sx={{ mt: 6, mx: 'auto', maxWidth: 1200 }}>
        <Footer />
      </Box>
    </>
  );
}
