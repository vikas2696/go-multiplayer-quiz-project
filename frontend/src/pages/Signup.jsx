import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import FloatingSymbols from '../components/FloatingSymbols';

const Signup = () => {
  const [authType, setAuthType] = React.useState('signup');

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === 'signup' ? 'login' : 'signup'));
  };

  return (
    <>
      {/* Stars background */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)',
          backgroundPosition: '0 0, 25px 25px',
          backgroundSize: '50px 50px',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.2,
        }}
      />

      {/* Floating symbols smaller */}
      <FloatingSymbols scale={0.5} />

      {/* Header pinned top center */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          position: 'fixed',
          top: 16,
          left: 0,
          right: 0,
          color: 'white',
          fontWeight: 'bold',
          userSelect: 'none',
          zIndex: 2,
        }}
      >
        QUIZ
      </Typography>

      {/* Form container */}
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          px: 2,
          position: 'relative',
          zIndex: 1,
          maxWidth: 400,
          margin: '0 auto',
        }}
      >
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          variant="outlined"
          InputProps={{
            sx: {
              borderRadius: '20px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '2px solid black',
              boxShadow: 'inset 2px 2px 5px #000000cc, inset -2px -2px 5px #333',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
                borderWidth: 2,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
                borderWidth: 3,
              },
            },
          }}
          InputLabelProps={{
            sx: { color: '#bbb' },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
          InputProps={{
            sx: {
              borderRadius: '20px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '2px solid black',
              boxShadow: 'inset 2px 2px 5px #000000cc, inset -2px -2px 5px #333',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
                borderWidth: 2,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
                borderWidth: 3,
              },
            },
          }}
          InputLabelProps={{
            sx: { color: '#bbb' },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
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
        >
          {authType === 'signup' ? 'Sign Up' : 'Log In'}
        </Button>

        <Typography
          variant="body2"
          onClick={toggleAuthType}
          sx={{
            mt: 1,
            color: '#ccc',
            textDecoration: 'underline',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '0.8rem',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {authType === 'signup'
            ? 'Already have an account? Log In'
            : "Don't have an account? Sign Up"}
        </Typography>
      </Box>
    </>
  );
};

export default Signup;
