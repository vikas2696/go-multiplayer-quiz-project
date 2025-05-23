import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios'; // Import axios for HTTP requests
import FloatingSymbols from '../components/FloatingSymbols';

const Signup = () => {
  const [authType, setAuthType] = React.useState('signup');
  
  // State to store form data
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  });
  
  // State to handle loading and messages
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [token, setToken] = React.useState(''); // State to store and display token

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === 'signup' ? 'login' : 'signup'));
    // Clear messages when switching
    setMessage('');
    setError('');
    setToken(''); // Clear token when switching
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setToken(''); // Clear previous token

    try {
      // Your exact backend URLs
      const endpoint = authType === 'signup' ? 'http://localhost:8080/signup' : 'http://localhost:8080/login';
      
      const response = await axios.post(endpoint, {
        username: formData.username,
        password: formData.password
      });

      // Handle successful response
      console.log('Success data:', response.data);
      
      if (authType === 'signup') {
        // Your signup response: {"User created with user Id": user.UserId}
        const userId = response.data["User created with user Id"];
        setMessage(`Account created successfully! User ID: ${userId}`);
      } else {
        // Your login response: {"Login Successful with session token ": token}
        const token = response.data["Login Successful with session token "];
        setMessage('Login successful!');
        
        // Store and display the token
        if (token) {
          localStorage.setItem('token', token);
          setToken(token); // Store token in state to display
          console.log('Token stored:', token);
        } else {
          console.log('No token found in response');
          console.log('Available keys:', Object.keys(response.data));
        }
      }

    } catch (error) {
      // Handle errors - Your backend sends errors in different Message fields
      console.error('Full error object:', error);
      console.error('Error response data:', error.response?.data);
      
      if (error.response && error.response.data) {
        // Server responded with error status
        let errorMessage = 'Something went wrong';
        
        // Your backend sends errors as Message1, Message2, Message3
        if (error.response.data.Message1) {
          errorMessage = error.response.data.Message1;
        } else if (error.response.data.Message2) {
          errorMessage = error.response.data.Message2;
        } else if (error.response.data.Message3) {
          errorMessage = error.response.data.Message3;
        } else {
          // Fallback: try to find any message field
          const data = error.response.data;
          const messageKey = Object.keys(data).find(key => 
            key.toLowerCase().includes('message') || 
            key.toLowerCase().includes('error')
          );
          if (messageKey) {
            errorMessage = data[messageKey];
          }
        }
        
        setError(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError('Cannot connect to server. Please check if your backend is running.');
      } else {
        // Something else happened
        setError('An unexpected error occurred: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
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
        onSubmit={handleSubmit} // Add form submission handler
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
        {/* Show error message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%', 
              mb: 2,
              backgroundColor: '#d32f2f',
              color: 'white',
              borderRadius: '10px',
              '& .MuiAlert-icon': {
                color: 'white',
              },
              '& .MuiAlert-message': {
                color: 'white',
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Show token after successful login */}
        {token && (
          <Box
            sx={{
              width: '100%',
              mb: 2,
              p: 2,
              backgroundColor: '#1e1e1e',
              border: '2px solid #4caf50',
              borderRadius: '10px',
            }}
          >
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 1 }}>
              Your Login Token:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                backgroundColor: '#000',
                p: 1,
                borderRadius: '5px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                wordBreak: 'break-all',
              }}
            >
              {token}
            </Typography>
          </Box>
        )}

        {/* Show success message */}
        {message && (
          <Alert 
            severity="success" 
            sx={{ 
              width: '100%', 
              mb: 2,
              backgroundColor: '#2e7d32',
              color: 'white',
              borderRadius: '10px',
              '& .MuiAlert-icon': {
                color: 'white',
              },
              '& .MuiAlert-message': {
                color: 'white',
              }
            }}
          >
            {message}
          </Alert>
        )}

        <TextField
          fullWidth
          name="username" // Add name attribute
          label="Username"
          value={formData.username} // Controlled input
          onChange={handleInputChange} // Handle changes
          margin="normal"
          variant="outlined"
          disabled={loading} // Disable when loading
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
          name="password" // Add name attribute
          label="Password"
          type="password"
          value={formData.password} // Controlled input
          onChange={handleInputChange} // Handle changes
          margin="normal"
          variant="outlined"
          disabled={loading} // Disable when loading
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
          type="submit" // Make it a submit button
          variant="contained"
          disabled={loading} // Disable when loading
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
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            authType === 'signup' ? 'Sign Up' : 'Log In'
          )}
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