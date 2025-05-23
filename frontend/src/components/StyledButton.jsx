import React from 'react';
import { Button } from '@mui/material';

const StyledButton = ({ children, ...props }) => (
  <Button
    fullWidth
    variant="contained"
    sx={{
      borderRadius: '20px',
      fontWeight: 'bold',
      backgroundColor: 'black',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.6)',
      color: 'white',
      '&:hover': {
        backgroundColor: '#222',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.8)',
      },
    }}
    {...props}
  >
    {children}
  </Button>
);

export default StyledButton;
