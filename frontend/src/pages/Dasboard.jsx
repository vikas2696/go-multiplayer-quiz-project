import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import axios from 'axios';

const AnimatedStars = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: star.duration, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint = isLogin
        ? 'http://localhost:8080/login'
        : 'http://localhost:8080/signup';

      const response = await axios.post(endpoint, formData);

      if (isLogin) {
        const token = response.data.token;
        setMessage('Login successful!');
        if (token) {
          localStorage.setItem('token', token);
          navigate('/quizrooms');
        }
      } else {
        setMessage('Account created successfully! Login to continue.');
        setIsLogin(true);
      }
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        const messageKey = Object.keys(data).find(
          (key) => key.toLowerCase().includes('message') || key.toLowerCase().includes('error')
        );
        setError(messageKey ? data[messageKey] : 'Something went wrong');
      } else if (err.request) {
        setError('Cannot connect to server.');
      } else {
        setError('An unexpected error occurred: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: darkMode ? '#1a1a1a' : '#f5f5f5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        gap: 2,
        color: darkMode ? 'white' : 'black',
        fontFamily: 'Roboto, sans-serif',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <AnimatedStars />

      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: darkMode ? 'white' : 'black',
          zIndex: 10,
        }}
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </IconButton>

      <Typography
        variant="h2"
        sx={{
          mb: 3,
          fontWeight: 700,
          letterSpacing: '2px',
          userSelect: 'none',
          zIndex: 1,
        }}
      >
        The Surface Quiz
      </Typography>

      {error && (
        <Alert severity="error" sx={{ zIndex: 1, width: '80%', maxWidth: 300 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ zIndex: 1, width: '80%', maxWidth: 300 }}>
          {message}
        </Alert>
      )}

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
          zIndex: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          variant="standard"
          type="text"
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
        />
      </Box>

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
          zIndex: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          variant="standard"
          type="password"
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
        />
      </Box>

      <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto', zIndex: 1 }}>
        <Button
          fullWidth
          onClick={handleAuth}
          disabled={loading}
          sx={{
            py: 1.1,
            borderRadius: '20px',
            fontSize: '0.85rem',
            textTransform: 'none',
            color: '#fff',
            background: '#000',
            border: darkMode
              ? `1px solid ${theme.palette.divider}`
              : `2px solid ${theme.palette.divider}`,
            '&:hover': {
              background: darkMode ? '#1a1a1a' : '#222',
            },
            '&:focus-visible': {
              outline: 'none',
              borderColor: '#66ccff',
              boxShadow: '0 0 6px 2px #66ccff',
            },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : isLogin ? 'Login' : 'Create Account'}
        </Button>
      </Box>

      <Typography
        sx={{
          color: darkMode ? '#aaa' : '#555',
          mt: 1,
          fontSize: '0.75rem',
          zIndex: 1,
        }}
      >
        {isLogin ? 'New here?' : 'Already have an account?'}{' '}
        <Link
          component="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setMessage('');
          }}
          underline="hover"
          sx={{
            color: '#66ccff',
            ml: 0.5,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {isLogin ? 'Create Account' : 'Login'}
        </Link>
      </Typography>
    </Box>
  );
}
