import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const FloatingSymbols = () => {
  const symbols = ['atom', 'rocket', 'microscope', 'flask-conical', 'telescope'];
  const positions = [
    { top: '10%', left: '20%' },
    { top: '30%', right: '25%' },
    { bottom: '20%', left: '15%' },
    { bottom: '10%', right: '20%' },
    { top: '50%', left: '50%' },
  ];

  return (
    <>
      {symbols.map((symbol, i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.1)',
            pointerEvents: 'none',
            zIndex: 0,
            ...positions[i],
          }}
        >
          <i className={`lucide lucide-${symbol}`} />
        </motion.div>
      ))}
    </>
  );
};

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = () => {
    // Add your authentication logic here
    navigate('/quizrooms');
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
      <FloatingSymbols />

      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: darkMode ? 'white' : 'black',
          outline: 'none',
          zIndex: 10,
        }}
        aria-label="Toggle light/dark mode"
        disableRipple
        disableFocusRipple
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          letterSpacing: '2px',
          userSelect: 'none',
          zIndex: 1,
        }}
      >
        QuiZ
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
        }}
      >
        <TextField
          fullWidth
          placeholder="Username"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onClick={handleLogin}
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
          {isLogin ? 'Login' : 'Create Account'}
        </Button>
      </Box>

      <Typography
        sx={{
          color: darkMode ? '#aaa' : '#555',
          mt: 1,
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {isLogin ? 'New here?' : 'Already have an account?'}{' '}
        <Link
          component="button"
          onClick={() => setIsLogin(!isLogin)}
          underline="hover"
          sx={{
            color: '#66ccff',
            ml: 0.5,
            outline: 'none',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
          disableRipple
          disableFocusRipple
        >
          {isLogin ? 'Create Account' : 'Login'}
        </Link>
      </Typography>
    </Box>
  );
}
