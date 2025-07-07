import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PsychologyIcon from '@mui/icons-material/Psychology';

const features = [
  {
    icon: <BarChartIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Smart Data Analysis',
    description: 'Advanced algorithms automatically detect patterns and anomalies in your Excel data.'
  },
  {
    icon: <FlashOnIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Auto Chart Generation',
    description: 'AI creates the perfect visualizations based on your data type and business context.'
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Real-time Processing',
    description: 'Lightning-fast analysis that processes thousands of rows in seconds.'
  },
  {
  icon: <PsychologyIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
  title: 'AI Integration',
  description: 'Empowered by intelligent models that uncover patterns, predict trends, and drive smarter decisions.'
}

];

const FeaturesSection = () => {
  return (
    <Box id="features" sx={{ py: 8, backgroundColor: 'white', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Powerful Features for Modern Analytics
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 6 }}>
          Everything you need to transform your spreadsheet data into actionable business insights
        </Typography>

        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ flexWrap: 'wrap', overflowX: 'visible' }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={6} sm={6} md={3} sx={{ flexShrink: 0 }}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: 'left', cursor: 'default', height: 250, minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
