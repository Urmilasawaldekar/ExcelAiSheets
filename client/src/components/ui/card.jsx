import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const Card = ({ children, className }) => {
  return (
    <Paper elevation={3} className={className} sx={{ padding: 2, borderRadius: 2 }}>
      {children}
    </Paper>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <Box className={className} sx={{ marginBottom: 1 }}>
      {children}
    </Box>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <Typography variant="subtitle1" className={className} sx={{ fontWeight: 'bold' }}>
      {children}
    </Typography>
  );
};

export const CardDescription = ({ children, className }) => {
  return (
    <Typography variant="body2" color="text.secondary" className={className}>
      {children}
    </Typography>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <Box className={className} sx={{ paddingTop: 1 }}>
      {children}
    </Box>
  );
};
