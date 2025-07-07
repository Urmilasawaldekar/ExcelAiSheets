import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'API'],
  Company: ['About Us', 'Careers', 'News', 'Contact'],
  Resources: ['Documentation', 'Help Center', 'Community', 'Blog'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
};

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', pt: 8, pb: 4, width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw',  justifyContent:"center", alignItems:""}}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2} >
              <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' , display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', alignContent:"center", background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ExcelAI Analytics
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400" paragraph>
              We're on a mission to democratize data analytics. Founded in 2020 by Excel veterans and AI researchers, we believe every business should have access to powerful, intelligent data analysis tools without the complexity.
            </Typography>
          
          
            <Box display="flex" alignItems="center" justifyContent="centre">
              <IconButton aria-label="LinkedIn" color="inherit" href="#">
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="Twitter" color="inherit" href="#">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="GitHub" color="inherit" href="#">
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
         
      
        </Grid>
        <Box mt={6} pt={3} borderTop={1} borderColor="grey.800" textAlign="center" color="grey.500" fontSize="0.875rem">
          &copy; {new Date().getFullYear()} ExcelAI Analytics. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
