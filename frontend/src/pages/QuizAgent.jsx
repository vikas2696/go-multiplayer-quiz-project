import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from "../config";
import Switch from '@mui/joy/Switch';
import {
  Box,
  Button,
  TextField,
  Typography,
  Slider,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { GetErrorMessage } from '../utils/ErrorHandler';
import Starbg from '../components/Starbg';

export default function LoginPage() {
  const [formData, setFormData] = useState({ topic: '', difficulty: '' });
  const [loading, setLoading] = useState(false);
  const [agentCreated, setAgentCreated] = useState(false);
  const [time, setTime] = useState(10);
  const [number, setNumber] = useState(10);
  const [privacy, setPrivacy] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  const handleAgent = () => {
    if (formData.topic === '' || formData.difficulty === '') {
      toast.error('Please fill in all the fields!');
      return;
    }

    setLoading(true);

    axios.post(`${config.BASE_URL}/quiz-agent`, {
      "Topic": formData.topic,
      "NoQ": '10',
      "Difficulty": formData.difficulty,
    }, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      }
    }).then(response => {
      toast.success(response.data.message);
      setLoading(false);
      if (response.status === 201) {
        setAgentCreated(true);
      }
    }).catch(err => {
      toast.error(GetErrorMessage(err));
      setLoading(false);
    });
  };

  const handleCreate = () => {
    axios.post(`${config.BASE_URL}/create-quizroom`, {
      "Players": [{
        "PlayerId": decoded.user_id,
        "Username": decoded.username
      }],
      "TimerTime": time,
      "QuizTopic": "agent",
      "PlayersAnswers": {
        0: String(number),
        1: String(privacy)
      }
    }, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      }
    }).then(response => {
      toast.success(response.data.message);
      navigate(`/quizrooms/${response.data.quiz_id}/lobby`);
    }).catch(err => {
      toast.error(GetErrorMessage(err));
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 700, letterSpacing: '2px', userSelect: 'none', zIndex: 1, textAlign: 'center' }}
      >
        The Surface Quiz Generator
      </Typography>

      {/* Input: Topic */}
      {!agentCreated && (
      <Box sx={{
        width: '100%', maxWidth: 300, background: darkMode ? '#0d0d0d' : '#e0e0e0',
        borderRadius: '20px', boxShadow: darkMode
          ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
          : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
        border: `1px solid ${darkMode ? '#222' : '#ccc'}`, zIndex: 1
      }}>
        <TextField
          fullWidth placeholder="Topic"
          name="topic"
          value={formData.topic}
          onChange={handleInputChange}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: darkMode ? 'white' : 'black',
              px: 2, py: 1, fontSize: '0.85rem', background: 'transparent',
            },
          }}
        />
      </Box>)}

      {/* Input: Difficulty */}
      {!agentCreated && (
      <Box sx={{
        width: '100%', maxWidth: 300, background: darkMode ? '#0d0d0d' : '#e0e0e0',
        borderRadius: '20px', boxShadow: darkMode
          ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
          : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
        border: `1px solid ${darkMode ? '#222' : '#ccc'}`, zIndex: 1
      }}>
        <TextField
          fullWidth placeholder="Difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: darkMode ? 'white' : 'black',
              px: 2, py: 1, fontSize: '0.85rem', background: 'transparent',
            },
          }}
        />
      </Box>)}

      {!agentCreated && (
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <Button
            fullWidth
            onClick={handleAgent}
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
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Generate Quiz'}
          </Button>
        </Box>
      )}

      {agentCreated && (
        <>
          {/* Sliders */}
          <Box sx={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#666' }}>
                Time per Question: {time} seconds
              </Typography>
              <Slider value={time} onChange={(_, val) => setTime(val)} min={2} max={30} step={1}
                sx={{ color: '#66ccff' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#666' }}>
                No. of Questions: {number}
              </Typography>
              <Slider value={number} onChange={(_, val) => setNumber(val)} min={5} max={25} step={1}
                sx={{ color: '#66ccff' }} />
            </Box>
            {/* Privacy Switch */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#666', mr: 2 }}>
                Private:
              </Typography>
              <Switch checked={privacy} onChange={e => setPrivacy(e.target.checked)} />
            </Box>
            {/* Create Room Button */}
            <Button
              fullWidth
              onClick={handleCreate}
              sx={{
                py: 1.1,
                borderRadius: '20px',
                fontSize: '0.85rem',
                textTransform: 'none',
                color: '#fff',
                background: '#000',
                '&:hover': {
                  background: darkMode ? '#1a1a1a' : '#222',
                },
              }}
            >
              Create Room
            </Button>
          </Box>
        </>
      )}

      <Typography sx={{ color: darkMode ? '#aaa' : '#555', mt: 2, fontSize: '0.75rem', zIndex: 1 }}>
        IT IS NOT STABLE YET, WE ARE WORKING ON IT. YOU MIGHT NEED TO TRY MULTIPLE TIMES TO SUCCESSFULLY CREATE A QUIZ
      </Typography>
    </Box>
  );
}
