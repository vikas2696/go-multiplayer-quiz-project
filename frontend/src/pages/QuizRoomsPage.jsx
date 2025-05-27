import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedStars from '../components/Starbg';
import FloatingPlanets from '../components/FloatingPlanets'

import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Slider,
  useTheme,
} from '@mui/material';

export default function QuizRoomPage() {
  const theme = useTheme();
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState(10);
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleRoom = () => {
    // Add your authentication logic here
    navigate('/lobby');
  };

  const textFieldStyles = (darkMode) => ({
    width: '100%',
    background: darkMode ? '#0d0d0d' : '#e0e0e0',
    borderRadius: '20px',
    boxShadow: darkMode
      ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
      : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
    border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
  });

  const buttonStyles = {
    py: 1.1,
    borderRadius: '20px',
    fontSize: '0.85rem',
    textTransform: 'none',
    color: '#fff',
    background: '#000',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      background: '#1a1a1a',
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: '#66ccff',
      boxShadow: '0 0 6px 2px #66ccff',
    },
  };

  const darkMode = true;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: darkMode ? '#1a1a1a' : '#f5f5f5',
        color: darkMode ? 'white' : 'black',
        fontFamily: 'Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        p: 10,
      }}
    >

    <AnimatedStars />
      {/* Section A */}
      <Box sx={{ flex: 1.5, overflowY: 'auto', p: 10, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 200,
              height: 100,
              borderRadius: 3,
              background: darkMode ? '#2a2a2a' : '#ddd',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Quiz Room #{i + 1}</Typography>
          </Box>
        ))}
      </Box>

      {/* Section B */}
      <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2 }}>
        {/* Section C */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column',py: 5, px: 30, gap: 2 }}>
          <Box sx={textFieldStyles(darkMode)}>
            <TextField
              select
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              variant="standard"
              placeholder="Choose Topic"
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
            >
              <MenuItem value="science">Science</MenuItem>
              <MenuItem value="history">History</MenuItem>
              <MenuItem value="math">Math</MenuItem>
            </TextField>
          </Box>

          <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
            Time Control: {time} seconds
          </Typography>
          <Slider
            value={time}
            onChange={(_, val) => setTime(val)}
            min={5}
            max={60}
            step={5}
            sx={{ color: '#66ccff' }}
          />

          <Button onClick = {handleRoom} sx={buttonStyles}>Create Quiz Room</Button>
        </Box>

        {/* Section D */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 30, py:5, gap: 2 }}>
          <Box sx={textFieldStyles(darkMode)}>
            <TextField
              fullWidth
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              variant="standard"
              placeholder="Enter Room Code"
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

          <Button onClick = {handleRoom} sx={buttonStyles}>Join</Button>
        </Box>
      </Box>
    </Box>
  );
}
