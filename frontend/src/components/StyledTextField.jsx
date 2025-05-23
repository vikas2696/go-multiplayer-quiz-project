import React from 'react';
import { TextField } from '@mui/material';

const StyledTextField = (props) => (
  <TextField
    fullWidth
    margin="normal"
    variant="outlined"
    InputProps={{
      sx: {
        borderRadius: '20px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        border: '2px solid black',
        boxShadow: 'inset 2px 2px 5px #000000cc, inset -2px -2px 5px #333',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black', borderWidth: 2 },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black', borderWidth: 3 },
      },
    }}
    InputLabelProps={{ sx: { color: '#bbb' } }}
    {...props}
  />
);

export default StyledTextField;
