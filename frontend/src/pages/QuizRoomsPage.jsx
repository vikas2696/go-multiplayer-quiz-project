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
import Switch from '@mui/joy/Switch';
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
  const [number, setNumber] = useState(10);
  const [privacy, setPrivacy] = useState(false);
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
      "QuizTopic": topic,
      "PlayersAnswers": {0: String(number), //using this for number of questions
                         1: String(privacy)} //using this for public/private
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

  const handleCardJoin = (room_id) => {
    axios.patch(`${config.BASE_URL}/quizrooms/${room_id}/join`, {}, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    }).then(response => {
      toast.success(response.data.message);
      navigate(`/quizrooms/${room_id}/lobby`);
    }).catch(err => {
      toast.error(GetErrorMessage(err));
    });
  }
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

      <Box
        sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
          maxHeight: '100%',
          boxSizing: 'border-box',
        }}>
        {rooms.filter(room => room.PlayersAnswers[1] === 'false').length > 0 ? (
          rooms.map((room, i) =>
            room.PlayersAnswers[1] === 'false' && (
              <Box
                key={i}
                sx={{
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
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Room #{room.QuizRoomId}
                </Typography>
                <Divider sx={{ my: 1, background: '#444' }} />
                <Typography variant="body2">⏱ Time: {room.TimerTime}s</Typography>
                <Typography variant="body2">📘 Topic: {room.QuizTopic}</Typography>
                <Typography variant="body2">
                  🔄 Status: {room.IsRunnning ? 'Running' : 'Waiting'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    visibility: room.IsRunnning ? 'hidden' : 'visible',
                  }}
                >
                  <Button
                    onClick={() => handleCardJoin(room.QuizRoomId)}
                    sx={{
                      ...buttonStyles(theme),
                      width: 100,
                      fontSize: '0.70rem',
                    }}
                  >
                    JOIN
                  </Button>
                </Box>
              </Box>
            )
          )
        ) : (
              <Typography sx={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', mt: 5 }}>
                No Active Public Rooms available...
                Create one now to start Quizzing...
              </Typography>
        )}
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
                <MenuItem value="cricket">Cricket</MenuItem>
                <MenuItem value="gk">General Knowledge</MenuItem>
                <MenuItem value="inventions">Inventions</MenuItem>
                <MenuItem value="indian_geography">Indian Geography</MenuItem>
                <MenuItem value="bollywood_fun">Bollywood Fun</MenuItem>
              </TextField>

          </Box>

          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
            
            {/* Time per Question */}
            <Box sx={{ width: '200px' }}>
              <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
                Time per Question: {time} seconds
              </Typography>
              <Slider
                value={time}
                onChange={(_, val) => setTime(val)}
                min={2}
                max={30}
                step={1}
                sx={{ color: '#66ccff' }}
              />
            </Box>

            {/* Number of Questions */}
            <Box sx={{ width: '200px' }}>
              <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
                No. of Questions: {number}
              </Typography>
              <Slider
                value={number}
                onChange={(_, val) => setNumber(val)}
                min={5}
                max={25}
                step={1}
                sx={{ color: '#66ccff' }}
              />
            </Box>
            <Box >
              <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
                Private:
              </Typography>
              <Switch
                checked={privacy}
                onChange={(event) => setPrivacy(event.target.checked)}
                sx={{ color: '#66ccff' }}
              />
            </Box>
        </Box>

          <Button onClick={handleCreate} sx={buttonStyles(theme)}>
            CREATE QUIZROOM
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
          <Button onClick={handleJoin} sx={buttonStyles(theme)}>JOIN</Button>
        </Box>
      </Box>
    </Box>
  );
}
