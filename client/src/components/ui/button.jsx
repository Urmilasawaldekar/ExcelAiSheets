import React from 'react';
import Button from '@mui/material/Button';

export const ButtonComponent = ({ variant = 'text', size = 'medium', children, ...props }) => {
  return (
    <Button variant={variant} size={size} {...props}>
      {children}
    </Button>
  );
};

// Export as Button to match import name in admin dashboard code
export { ButtonComponent as Button };
