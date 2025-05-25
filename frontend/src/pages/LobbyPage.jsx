import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Divider,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

// Reuse the FloatingSymbols and AnimatedStars from your login page
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

export default function LobbyPage() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  const quizRoom = {
    QuizRoomId: 101,
    Players: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ],
    TimerTime: 60,
    QuizTopic: 'Physics',
    IsRunnning: false,
    ScoreSheet: {
      1: 10,
      2: 5,
    },
    PlayersAnswers: {
      1: 'A',
      2: 'C',
    },
  };

  const handleStartQuiz = () => {
    // Add any state changes or API calls before navigating if needed
    navigate('/live');
  };

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
        alignItems: 'center',
        px: 2,
        py: 4,
        overflowY: 'auto',
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
          zIndex: 10,
        }}
        aria-label="Toggle light/dark mode"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </IconButton>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, zIndex: 1 }}>
        Quiz Lobby
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          background: darkMode ? '#0d0d0d' : '#e0e0e0',
          borderRadius: '20px',
          boxShadow: darkMode
            ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
            : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
          border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
          p: 3,
          zIndex: 1,
        }}
      >
        <Typography>Room ID: {quizRoom.QuizRoomId}</Typography>
        <Typography>Topic: {quizRoom.QuizTopic}</Typography>
        <Typography>Timer: {quizRoom.TimerTime} seconds</Typography>
        <Typography>Status: {quizRoom.IsRunnning ? 'Running' : 'Waiting'}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Players:</Typography>
        {quizRoom.Players.map((player) => (
          <Typography key={player.id}>
            {player.name} — Score: {quizRoom.ScoreSheet[player.id] ?? 0}, Answer: {quizRoom.PlayersAnswers[player.id] ?? '—'}
          </Typography>
        ))}

        <Button
          onClick={handleStartQuiz}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            fontWeight: 600,
            borderRadius: '12px',
            textTransform: 'none',
          }}
        >
          Start Quiz
        </Button>
      </Box>
    </Box>
  );
}
