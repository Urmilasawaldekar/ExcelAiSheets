import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const stats = [
  { icon: <BarChartIcon sx={{ fontSize: 40, color: '#1976d2' }} />, value: '10K+', label: 'Companies Trust Us' },
  { icon: <GroupIcon sx={{ fontSize: 40, color: '#1976d2' }} />, value: '250K+', label: 'Active Users' },
  { icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#1976d2' }} />, value: '99.9%', label: 'Uptime Guarantee' }
];

const AboutUs = () => {
  return (
    <Box id="about" sx={{ py: 8, background: 'linear-gradient(to bottom right, #e3f2fd, #e0f7fa)', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          About ExcelAI Analytics
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}>
          We're on a mission to democratize data analytics. Founded in 2020 by Excel veterans and AI researchers,
          we believe every business should have access to powerful, intelligent data analysis tools without the complexity.
        </Typography>

        <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                {stat.icon}
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
