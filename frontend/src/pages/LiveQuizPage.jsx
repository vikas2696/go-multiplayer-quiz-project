import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveQuizPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);

  const question = {
    text: 'What is the speed of light?',
    options: {
      a: '3 x 10^8 m/s',
      b: '1.5 x 10^7 m/s',
      c: '9.8 m/s²',
      d: '6.67 x 10^-11 N·m²/kg²',
    },
  };

  const handleSelect = (optionKey) => {
    setSelectedOption(prev => (prev === optionKey ? null : optionKey));
  };

  const getOptionStyles = (key) => {
    const isSelected = selectedOption === key;
    const muddyOrange = '#a1662f'; // slight orangish-brown

    return {
      background: isSelected ? muddyOrange : darkMode ? '#0d0d0d' : '#e0e0e0',
      boxShadow: isSelected
        ? darkMode
          ? '3px 3px 8px #000, -3px -3px 8px #1a1a1a'
          : '3px 3px 8px #c0c0c0, -3px -3px 8px #ffffff'
        : darkMode
        ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
        : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
      border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
      color: darkMode ? 'white' : 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: '0.1s',
    };
  };

  const symbols = ['atom', 'rocket', 'microscope', 'flask-conical', 'telescope'];
  const symbolPositions = [
    { top: '10%', left: '20%' },
    { top: '30%', right: '25%' },
    { bottom: '20%', left: '15%' },
    { bottom: '10%', right: '20%' },
    { top: '50%', left: '50%' },
  ];

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: darkMode ? '#1a1a1a' : '#f5f5f5',
        color: darkMode ? 'white' : 'black',
        fontFamily: 'Roboto, sans-serif',
        overflow: 'hidden',
        pb: 5, // padding at bottom of screen
      }}
    >
      {/* Stars */}
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

      {/* Floating symbols */}
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
            ...symbolPositions[i],
          }}
        >
          <i className={`lucide lucide-${symbol}`} />
        </motion.div>
      ))}

      {/* Theme toggle */}
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: darkMode ? 'white' : 'black',
          zIndex: 10,
        }}
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </IconButton>

      {/* Question */}
      <Box
        sx={{
          height: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {question.text}
        </Typography>
      </Box>

      {/* Options */}
      <Box
        sx={{
          height: '50%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 2,
          p: 3,
          pb: 5, // extra space from bottom
          zIndex: 1,
        }}
      >
        {Object.entries(question.options).map(([key, value]) => (
          <Box
            key={key}
            onClick={() => handleSelect(key)}
            sx={{
              borderRadius: '20px',
              ...getOptionStyles(key),
            }}
          >
            {key.toUpperCase()}: {value}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
