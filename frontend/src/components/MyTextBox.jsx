import React from 'react';
import { Box, TextField } from '@mui/material';

const InputField = ({ label, type = 'text', darkMode = false, ...props }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 300,
      background: darkMode ? '#0d0d0d' : '#e0e0e0',
      borderRadius: '20px',
      boxShadow: darkMode
        ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
        : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
      border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
      mb: 1.5,
    }}
  >
    <TextField
      fullWidth
      placeholder={label}
      type={type}
      variant="standard"
      InputProps={{
        disableUnderline: true,
        sx: {
          color: darkMode ? 'white' : 'black',
          px: 2,
          py: 1,
          fontSize: '0.85rem',
          background: 'transparent',
        },
      }}
      sx={{
        input: {
          background: 'transparent',
        },
      }}
      {...props}
    />
  </Box>
);

export default InputField;
