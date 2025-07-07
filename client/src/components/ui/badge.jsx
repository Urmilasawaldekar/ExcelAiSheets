import React from 'react';
import Chip from '@mui/material/Chip';

const variantMapping = {
  default: 'default',
  destructive: 'error',
  secondary: 'default',
};

export const Badge = ({ variant = 'default', children }) => {
  const color = variantMapping[variant] || 'default';
  return (
    <Chip
      label={children}
      color={color}
      size="small"
      sx={{ textTransform: 'capitalize' }}
    />
  );
};
