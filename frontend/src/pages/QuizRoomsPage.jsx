import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedStars from '../components/Starbg';
import axios from 'axios';
import { GetErrorMessage } from '../utils/ErrorHandler';
import { textFieldStyles } from '../components/EmbeddedTextField';
import { buttonStyles } from '../components/DarkButton';
import { jwtDecode } from 'jwt-decode'
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
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  const handleCreate = () => {
    axios.post('http://localhost:8080/create-quizroom',{
        "Players": [
          {
            "PlayerId": decoded.user_id,
            "Username": decoded.username
          }
        ],
        "TimerTime": time,
        "QuizTopic": topic
    },
    {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
     }
    })
    .then( response => {
      navigate(`/quizrooms/${response.data.quiz_id}/lobby`);
    })
    .catch(err => {
      console.log(GetErrorMessage(err));
    })
  };

  const handleJoin = () => {
    axios.patch('http://localhost:8080/quizrooms/'+roomCode+'/join',{},
      {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
     }
    })
    .then(response => {
      navigate(`/quizrooms/${roomCode}/lobby`);
    })
    .catch(err => {
      console.log(GetErrorMessage(err));
    })
  };

  useEffect(() => {
    axios.get('http://localhost:8080/quizrooms')
      .then(response => {
        setRooms(response.data.quizrooms);
      })
      .catch(err => {
        console.log(GetErrorMessage(err));
      });
  },[]);

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
        {rooms.map((room, i) => (
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
            <Typography>Quiz Room #{room.QuizRoomId}</Typography>
            <Typography>Time {room.TimerTime}</Typography>
            <Typography>Topic {room.QuizTopic}</Typography>
            <Typography>Status {room.IsRunnning}</Typography>
          </Box>
        ))}
      </Box>
      {/* Section B */}
      <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2 }}>
        {/* Section C */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column',py: 5, px: 30, gap: 2 }}>
          <Box sx={textFieldStyles(theme)}> 
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

          <Button onClick = {handleCreate} sx={buttonStyles(theme)}>Create Quiz Room</Button>
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

          <Button onClick = {handleJoin} sx={buttonStyles(theme)}>Join</Button>
        </Box>
      </Box>
    </Box>
  );
}
