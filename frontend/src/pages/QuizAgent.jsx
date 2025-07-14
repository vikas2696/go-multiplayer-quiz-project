import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from "../config";
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
  const [formData, setFormData] = useState({ topic: '', difficulty: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const theme = useTheme();

  const token = localStorage.getItem('token');
  //const decoded = jwtDecode(token);

  const handleAgent = () => {

    if(formData.topic === '' || formData.difficulty === '') {
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
      setLoading(false)
      //navigate(`/quizrooms/${response.data.quiz_id}/lobby`);
    }).catch(err => {
      toast.error(GetErrorMessage(err));
      setLoading(false)
    });

  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        sx={{
          mb: 3,
          fontWeight: 700,
          letterSpacing: '2px',
          userSelect: 'none',
          zIndex: 1,
          textAlign: 'center'
        }}
      >
        The Surface Quiz Generator
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
          placeholder="write a topic of your choice here"
          name="topic"
          value={formData.topic}
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
          placeholder="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          variant="standard"
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
            '&:focus-visible': {
              outline: 'none',
              borderColor: '#66ccff',
              boxShadow: '0 0 6px 2px #66ccff',
            },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Make a Quiz'}
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
      IT IS NOT STABLE YET, WE ARE WORKING ON IT. YOU MIGHT NEED TO TRY MULTIPLE TIMES TO SUCCESSFULLY CREATE A QUIZ
      </Typography>
    </Box>
  );
}
