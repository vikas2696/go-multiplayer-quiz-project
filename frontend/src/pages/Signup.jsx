import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from "../config";
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
import Starbg from '../components/Starbg'
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { GetErrorMessage } from '../utils/ErrorHandler';
import isTokenValid from '../utils/TokenHandler';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false); 
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

    useEffect(() => {
    if (isTokenValid()) {
      navigate('/quizrooms');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint = isLogin
        ? `${BASE_URL}/login`
        : `${BASE_URL}/signup`;

      const response = await axios.post(endpoint, formData);

      if (isLogin) {
        const token = response.data.token;
        setMessage('Login successful!')
        toast.success('Login successful!');
        if (token) {
          localStorage.setItem('token', token);
          navigate('/quizrooms');
        }
      } else {
        setMessage('Account created successfully! Login to continue.')
        toast.success('Account created successfully! Login to continue.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(GetErrorMessage(err))
      toast.error(GetErrorMessage(err))
      
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
      <Starbg />

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
        The Quiz
      </Typography>

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
          position: 'relative',
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
          position: 'relative',
        }}
      >
        <TextField
          fullWidth
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          variant="standard"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            disableUnderline: true,
            sx: {
              color: darkMode ? 'white' : 'black',
              px: 2,
              py: 1,
              fontSize: '0.85rem',
              background: 'transparent',
            },
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{
                  color: 'grey',
                  outline: 'none',
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            ),
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
