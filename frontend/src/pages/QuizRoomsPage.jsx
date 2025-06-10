import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedStars from '../components/Starbg';
import axios from 'axios';
import { GetErrorMessage } from '../utils/ErrorHandler';
import { textFieldStyles } from '../components/EmbeddedTextField';
import { buttonStyles } from '../components/DarkButton';
import { jwtDecode } from 'jwt-decode';
import config from "../config";
import { toast } from 'react-toastify';
import LogoutButton from '../components/LogoutButton';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Slider,
  useTheme,
  Divider,
} from '@mui/material';

export default function QuizRoomPage() {
  const theme = useTheme();
  const [topic, setTopic] = useState('science');
  const [time, setTime] = useState(10);
  const [roomCode, setRoomCode] = useState('');
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  const handleCreate = () => {
    axios.post(`${config.BASE_URL}/create-quizroom`, {
      "Players": [{
        "PlayerId": decoded.user_id,
        "Username": decoded.username
      }],
      "TimerTime": time,
      "QuizTopic": topic
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

  const handleJoin = () => {
    axios.patch(`${config.BASE_URL}/quizrooms/${roomCode}/join`, {}, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    }).then(response => {
      toast.success(response.data.message);
      navigate(`/quizrooms/${roomCode}/lobby`);
    }).catch(err => {
      toast.error(GetErrorMessage(err));
    });
  };

  useEffect(() => {
    axios.get(`${config.BASE_URL}/quizrooms`)
      .then(response => setRooms(response.data.quizrooms))
      .catch(err => toast.error(GetErrorMessage(err)));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successful!');
    navigate('/', { replace: true });
  };

  const darkMode = true;

  return (
    <Box sx={{
      position: 'absolute',
      inset: 0,
      background: darkMode ? '#1a1a1a' : '#f5f5f5',
      color: darkMode ? 'white' : 'black',
      fontFamily: 'Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AnimatedStars />

      {/* Top bar */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 6,
        py: 2,
        backgroundColor: '#111',
        boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
        zIndex: 1,
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>QUIZROOMS</Typography>
        <LogoutButton onLogout={logout} />
      </Box>

      {/* Room Cards */}
      <Box sx={{
        flex: 1.5,
        overflowY: 'auto',
        p: 6,
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {rooms.map((room, i) => (
          <Box key={i} sx={{
            width: 250,
            borderRadius: 4,
            background: '#222',
            border: '1px solid #333',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 30px rgba(255, 255, 255, 0.1)',
            }
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Room #{room.QuizRoomId}</Typography>
            <Divider sx={{ my: 1, background: '#444' }} />
            <Typography variant="body2">⏱ Time: {room.TimerTime}s</Typography>
            <Typography variant="body2">📘 Topic: {room.QuizTopic}</Typography>
            <Typography variant="body2">🔄 Status: {room.IsRunnning ? "Running" : "Waiting"}</Typography>
          </Box>
        ))}
      </Box>

      {/* Create & Join */}
      <Box sx={{ flex: 1, display: 'flex', paddingTop: 10, gap: 4 }}>
        {/* Create Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 30, gap: 2 }}>
          <Box sx={textFieldStyles(theme)}>
              <TextField
                select
                fullWidth
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: 'white',
                    px: 2,
                    py: 1,
                    fontSize: '0.85rem',
                    background: 'transparent',
                  },
                }}
                InputLabelProps={{
                  sx: { color: 'white' },
                }}
              >
                <MenuItem value="science">Science</MenuItem>
                <MenuItem value="geography">Geography</MenuItem>
                <MenuItem value="capitals">Capitals</MenuItem>
                <MenuItem value="computers">Computers</MenuItem>
              </TextField>

          </Box>

          <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
            Time per Question: {time} seconds
          </Typography>
          <Slider
            value={time}
            onChange={(_, val) => setTime(val)}
            min={3}
            max={60}
            step={1}
            sx={{ color: '#66ccff' }}
          />

          <Button onClick={handleCreate} sx={buttonStyles(theme)}>
            Create Quiz Room
          </Button>
        </Box>

        {/* Join Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 30, gap: 2 }}>
          <Box sx={textFieldStyles(theme)}>
            <TextField
              fullWidth
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              variant="standard"
              placeholder="Enter Room Code"
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: 'white',
                  px: 2,
                  py: 1,
                  fontSize: '0.85rem',
                  background: 'transparent',
                },
              }}
            />
          </Box>

          <Button onClick={handleJoin} sx={buttonStyles(theme)}>Join</Button>
        </Box>
      </Box>
    </Box>
  );
}
