import React from 'react';
import { Button } from '@mui/material';

const PrimaryButton = ({ children, darkMode = false, ...props }) => (
  <Button
    fullWidth
    sx={{
      py: 1.1,
      borderRadius: '20px',
      fontSize: '0.85rem',
      textTransform: 'none',
      color: '#fff',
      backgroundColor: '#000',
      border: darkMode ? '1px solid #444' : '2px solid #444',
      '&:hover': {
        backgroundColor: darkMode ? '#222' : '#222',
      },
      '&:focus-visible': {
        outline: 'none',
        borderColor: '#66ccff',
        boxShadow: '0 0 6px 2px #66ccff',
      },
    }}
    {...props}
  >
    {children}
  </Button>
);

export default PrimaryButton;
