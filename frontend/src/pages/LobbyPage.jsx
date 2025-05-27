import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Starbg from '../components/Starbg';
import axios from 'axios';
import { GetErrorMessage } from '../utils/ErrorHandler';
import { jwtDecode } from 'jwt-decode';

export default function LobbyPage() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const [quizRoom, setQuizRoom] = useState({});

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const { quizId } = useParams();

  useEffect(() => {
      axios.get('http://localhost:8080/quizrooms/'+ quizId +'/lobby',
    {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
     }
    }
  )
    .then(response => {
      setQuizRoom(response.data.quizroom)
    })
    .catch(err => {
      GetErrorMessage(err)
    })

    const handleUnload = () => {
    fetch(`http://localhost:8080/quizrooms/${quizId}/leave`, {
      method: 'PATCH',
      headers: {
        'Authorization': `${token}`,
      },
        keepalive: true,
      });
    };

      window.addEventListener('beforeunload', handleUnload);
      return () => window.removeEventListener('beforeunload', handleUnload);

    },[]);

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
            {quizRoom?.Players?.map((player) => (
              <Typography key={player.PlayerId}>
                {player.Username} — Score: {quizRoom.ScoreSheet[player.PlayerId] ?? 0}
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
