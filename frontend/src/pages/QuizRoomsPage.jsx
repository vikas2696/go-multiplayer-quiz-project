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
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import { Sun, Moon, Plus, Users } from 'lucide-react';
import CompactCard from '../components/QuizRoomCard';

export default function QuizRoomPage() {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(true);
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

  return (
    <Box sx={{
      position: 'absolute',
      inset: 0,
      background: darkMode ? '#1a1a1a' : '#f5f5f5',
      color: darkMode ? 'white' : 'black',
      fontFamily: 'Roboto, sans-serif',
      display: 'flex',
      pb: 0,
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <AnimatedStars />

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 2,
          zIndex: 10,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, zIndex: 1 }}>
          QUIZROOMS
        </Typography>
      </Box>

      <LogoutButton onLogout={logout} />

      {/* Main Content */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: 3, 
          p: 2,
          overflow: 'hidden',
          minHeight: 0
        }}
      >
        {/* Available Rooms Section */}
        <Box
          sx={{
            flex: { xs: 1, lg: 2 },
            display: 'flex',
            flexDirection: 'column',
            background: darkMode ? '#0d0d0d' : '#e0e0e0',
            borderRadius: '20px',
            boxShadow: darkMode
              ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
              : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
            border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
            overflow: 'hidden',
            minHeight: { xs: '300px', lg: 'auto' },
          }}
        >
          {/* Rooms Grid */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 3,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'left',
              alignItems: 'flex-start',
              minHeight: 0,
            }}
          >
            {rooms.filter(room => room.PlayersAnswers[1] === 'false').length > 0 ? (
              rooms.map((room, i) =>
                room.PlayersAnswers[1] === 'false' && (
                 // <CompactCard room= {room} handleCardJoin={handleCardJoin} theme={theme}/>
                <Box>
                  <Card
                    key={i}
                    sx={{
                      backgroundColor: 'rgba(17, 17, 17, 0.4)',
                      color: '#c9d1d9',
                      borderRadius: 2,
                      border: '1px solid #21262d',
                      fontFamily: 'monospace',
                      position: 'relative',
                      minWidth: 200,
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 6px 30px rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1,
                        backgroundColor: '#161b22',
                        borderBottom: '1px solid #21262d',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Circle sx={{ fontSize: 8, color: '#58a6ff' }} />
                        <Circle sx={{ fontSize: 8, color: '#58a6ff' }} />
                        <Circle sx={{ fontSize: 8, color: '#58a6ff' }} />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#fd9917',
                          fontWeight: 500,
                        }}
                      >
                        {room.IsRunning ? 'QUIZZING' : 'IN LOBBY'}
                      </Typography>
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ px: 3, pt: 3, pb: 0, textAlign: 'center' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#58a6ff',
                          fontWeight: 600,
                          letterSpacing: 1,
                          mb: 1,
                        }}
                      >
                        QuizRoom #{room.QuizRoomId}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 700,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          mb: 1,
                        }}
                      >
                        {room.QuizTopic}
                      </Typography>

                      <Box sx={{ lineHeight: 1.8 }}>
                        <Typography variant="body2" sx={{ color: '#c9d1d9' }}>
                          Timer: <span style={{ color: '#58a6ff' }}>{room.TimerTime}s</span>
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#c9d1d9' }}>
                          Players In:{' '}
                          <span style={{ color: '#58a6ff' }}>{room.Players.length}</span>
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#c9d1d9' }}>
                          Questions:{' '}
                          <span style={{ color: '#58a6ff' }}>{room.PlayersAnswers[0]}</span>
                        </Typography>
                      </Box>
                    </CardContent>

                    {/* Join Button */}
                    <CardActions sx={{ px: 3, pt: 2, pb: 2, justifyContent: 'center' }}>
                      <Button
                        onClick={() => handleCardJoin(room.QuizRoomId)}
                        sx={{
                          ...buttonStyles(theme),
                          width: 100,
                          fontSize: '0.70rem',
                          py: 0.8,
                          px: 1,
                          m: 2,
                        }}
                      >
                        JOIN
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
                )
              )
            ) : (
              <Typography variant= 'h6' sx={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', m: 5 }}>
                No Active Public Rooms available...
                Create one now to start Quizzing...
              </Typography>
            )}
          </Box>
        </Box>

        {/* Create & Join Section */}
        <Box
          sx={{
            flex: { xs: 1, lg: 1 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            minHeight: { xs: 'auto', lg: '600px' },
          }}
        >
          {/* Create Room Card */}
          <Box
            sx={{
              background: darkMode ? '#0d0d0d' : '#e0e0e0',
              borderRadius: '20px',
              boxShadow: darkMode
                ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
                : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
              border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
              p: 3,
              flex: 2,
              minHeight: '400px',
            }}
          >
            <Typography sx={{ 
              fontWeight: 600, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '1.1rem'
            }}>
              Create New QuizRoom
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Topic Selection */}
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
                      color: darkMode ? 'white' : 'black',
                      px: 2,
                      py: 1,
                      fontSize: '0.85rem',
                      background: 'transparent',
                    },
                  }}
                  InputLabelProps={{
                    sx: { color: darkMode ? '#aaa' : '#666' },
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

              {/* Sliders */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography gutterBottom sx={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#666', mb: 1 }}>
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

                <Box>
                  <Typography gutterBottom sx={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#666', mb: 1 }}>
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
              </Box>

              {/* Privacy Switch */}
              <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Typography sx={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#666', mr: 2 }}>
                  Private:
                </Typography>
                <Switch
                  checked={privacy}
                  onChange={(event) => setPrivacy(event.target.checked)}
                  sx={{ 
                    '--Switch-thumbSize': '20px',
                    '--Switch-trackWidth': '40px',
                    '--Switch-trackHeight': '24px',
                  }}
                />
              </Box>

              <Button 
                onClick={handleCreate} 
                sx={{
                  ...buttonStyles(theme),
                  mt: 2,
                }}
              >
                CREATE QUIZROOM
              </Button>
            </Box>
          </Box>

          {/* Join Room Card */}
          <Box
            sx={{
              background: darkMode ? '#0d0d0d' : '#e0e0e0',
              borderRadius: '20px',
              boxShadow: darkMode
                ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
                : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
              border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
              p: 3,
              flex: 1,
              minHeight: '150px',
            }}
          >
            <Typography sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>
              Join Existing QuizRoom
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                      color: darkMode ? 'white' : 'black',
                      px: 2,
                      py: 1,
                      fontSize: '0.85rem',
                      background: 'transparent',
                    },
                  }}
                />
              </Box>
              <Button 
                onClick={handleJoin} 
                sx={buttonStyles(theme)}
              >
                JOIN
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}