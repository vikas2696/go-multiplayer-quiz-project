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
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState(10);
  const [number, setNumber] = useState(10);
  const [privacy, setPrivacy] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  const handleCreate = () => {
    if(topic === '') {
      toast.error('No topic chosen!');
      return;
    }
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
      .then(response => {setRooms(response.data.quizrooms)
        //console.log(response.data.quizrooms)
      })
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

  const handleCardClick = (room) => {
    //lets see
  }

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
        overflow: 'hidden',
      }}
    >
      <AnimatedStars />

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 2,
          zIndex: 10,
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 700, zIndex: 1 }}
        >
          QUIZROOMS
        </Typography>
        <LogoutButton onLogout={logout} />
      </Box>

      {/* Main content here... */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          px: 2,
          pb: 2,
          overflowY: 'auto', 
          minHeight: 0,    
        }}
      >
        {/* Available Rooms Section */}
        <Box
          sx={{
            flex: { xs: 'none', lg: 2 },
            display: 'flex',
            flexDirection: 'column',
            background: darkMode ? '#0d0d0d' : '#e0e0e0',
            borderRadius: { xs: '15px', sm: '20px' },
            boxShadow: darkMode
              ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
              : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
            border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
            overflow: 'hidden',
            height: { xs: '350px', sm: '400px', lg: 'auto' },
            minHeight: { xs: '350px', sm: '400px', lg: 'auto' },
          }}
        >
          {/* Rooms Grid */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: { xs: 1.5, sm: 2, md: 3 },
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2, md: 3 },
              justifyContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'flex-start',
              minHeight: 0,
            }}
          >
            {rooms && Array.isArray(rooms) && rooms.filter(room => room.PlayersAnswers[1] === 'false').length > 0 ? (
              rooms.map((room, i) =>
                room.PlayersAnswers[1] === 'false' && !room.IsRunnning &&(
                  <Box key={i} sx={{ 
                    width: { xs: 'calc(50% - 8px)', sm: '280px', md: '200px' },
                    minWidth: { xs: '140px', sm: '200px' }
                  }}>
                    <Card
                      onClick= {handleCardClick}
                      sx={{
                        backgroundColor: 'rgba(17, 17, 17, 0.4)',
                        color: '#c9d1d9',
                        borderRadius: 2,
                        border: '1px solid #21262d',
                        fontFamily: 'monospace',
                        position: 'relative',
                        width: '100%',
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
                            color: room.IsRunnning ? '#fd9917' : '#00e676',
                            fontWeight: 500,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' }
                          }}
                        >
                          {room.IsRunnning ? 'IN QUIZ' : 'IN LOBBY'}
                        </Typography>
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ px: { xs: 1, sm: 2 }, pt: { xs: 1, sm: 2 }, pb: 0, textAlign: 'center' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#58a6ff',
                            fontWeight: 600,
                            letterSpacing: { xs: 0.5, sm: 1 },
                            mb: { xs: 0.5, sm: 1 },
                            fontSize: { xs: '0.7rem', sm: '0.975rem' }
                          }}
                        >
                          QuizRoom #{room.QuizRoomId}
                        </Typography>

                        <Typography
                          variant="h6"
                          sx={{
                            color: '#ffffff',
                            fontWeight: 700,
                            letterSpacing: { xs: 0.5, sm: 1 },
                            textTransform: 'uppercase',
                            mb: { xs: 0.5, sm: 1 },
                            fontSize: { xs: '0.75rem', sm: '1.25rem' },
                            lineHeight: { xs: 1.2, sm: 1.4 }
                          }}
                        >
                          {room.QuizTopic}
                        </Typography>

                        <Box sx={{ lineHeight: { xs: 1.3, sm: 1.6 } }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#c9d1d9',
                              fontSize: { xs: '0.6rem', sm: '0.875rem' },
                              mb: { xs: 0.2, sm: 0.5 }
                            }}
                          >
                            Host: <span style={{ color: '#58a6ff' }}>{room.Players.length != 0 ? room.Players[0].Username : 'None'}</span>
                          </Typography>

                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: '#c9d1d9',
                              fontSize: { xs: '0.6rem', sm: '0.875rem' },
                              mb: { xs: 0.2, sm: 0.5 }
                            }}
                          >
                            Timer: <span style={{ color: '#58a6ff' }}>{room.TimerTime}s</span>
                          </Typography>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#c9d1d9',
                              fontSize: { xs: '0.6rem', sm: '0.875rem' },
                              mb: { xs: 0.2, sm: 0.5 }
                            }}
                          >
                            Players:{' '}
                            <span style={{ color: '#58a6ff' }}>{room.Players.length}</span>
                          </Typography>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#c9d1d9',
                              fontSize: { xs: '0.6rem', sm: '0.875rem' }
                            }}
                          >
                            Questions:{' '}
                            <span style={{ color: '#58a6ff' }}>{room.PlayersAnswers[0]}</span>
                          </Typography>
                        </Box>
                      </CardContent>

                      {/* Join Button */}
                      <CardActions sx={{ px: { xs: 1, sm: 2 }, pt: { xs: 0.5, sm: 1 }, pb: { xs: 1, sm: 2 }, justifyContent: 'center' }}>
                        <Button
                          onClick={() => handleCardJoin(room.QuizRoomId)}
                          sx={{
                            ...buttonStyles(theme),
                            width: { xs: '60px', sm: '100px' },
                            height: { xs: '28px', sm: '36px' },
                            fontSize: { xs: '0.6rem', sm: '0.70rem' },
                            py: { xs: 0.4, sm: 0.8 },
                            px: { xs: 0.8, sm: 1 },
                            minWidth: { xs: '60px', sm: '100px' },
                            visibility: room.IsRunnning ? 'hidden' : 'visible',
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
              <Typography 
                variant='h6' 
                sx={{ 
                  color: '#aaa', 
                  fontStyle: 'italic', 
                  textAlign: 'center', 
                  m: { xs: 2, sm: 3, md: 5 },
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  width: '100%'
                }}
              >
                No Active Public Rooms available...
                <br />
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
            gap: { xs: 2, sm: 3 },
            minHeight: { xs: 'auto', lg: '600px' },
          }}
        >
          {/* Create Room Card */}
          <Box
            sx={{
              background: darkMode ? '#0d0d0d' : '#e0e0e0',
              borderRadius: { xs: '15px', sm: '20px' },
              boxShadow: darkMode
                ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
                : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
              border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
              p: { xs: 2, sm: 3 },
              flex: { xs: 'none', lg: 2 },
              minHeight: { xs: '300px', sm: '350px', lg: '400px' },
            }}
          >
            <Typography sx={{ 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3 },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}>
              Create New QuizRoom
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
              {/* Topic Selection */}
              <Box sx={textFieldStyles(theme)}>
                <TextField
                  select
                  fullWidth
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  variant="standard"
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) =>
                      selected === '' ? (
                        <span style={{ color: darkMode ? '#888' : '#888' }}>
                          Click here to choose a topic
                        </span>
                      ) : (
                        selected
                      ),
                  }}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      color: darkMode ? 'white' : 'black',
                      px: 2,
                      py: 1,
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      background: 'transparent',
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Click here to choose a topic
                  </MenuItem>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                <Box>
                  <Typography 
                    gutterBottom 
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.85rem' }, 
                      color: darkMode ? '#ccc' : '#666', 
                      mb: 1 
                    }}
                  >
                    Time per Question: {time} seconds
                  </Typography>
                  <Slider
                    value={time}
                    onChange={(_, val) => setTime(val)}
                    min={2}
                    max={30}
                    step={1}
                    sx={{ 
                      color: '#66ccff',
                      '& .MuiSlider-thumb': {
                        width: { xs: 16, sm: 20 },
                        height: { xs: 16, sm: 20 },
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    gutterBottom 
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.85rem' }, 
                      color: darkMode ? '#ccc' : '#666', 
                      mb: 1 
                    }}
                  >
                    No. of Questions: {number}
                  </Typography>
                  <Slider
                    value={number}
                    onChange={(_, val) => setNumber(val)}
                    min={5}
                    max={25}
                    step={1}
                    sx={{ 
                      color: '#66ccff',
                      '& .MuiSlider-thumb': {
                        width: { xs: 16, sm: 20 },
                        height: { xs: 16, sm: 20 },
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Privacy Switch */}
              <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Typography sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.85rem' }, 
                  color: darkMode ? '#ccc' : '#666', 
                  mr: 2 
                }}>
                  Private:
                </Typography>
                <Switch
                  checked={privacy}
                  onChange={(event) => setPrivacy(event.target.checked)}
                  sx={{ 
                    '--Switch-thumbSize': { xs: '18px', sm: '20px' },
                    '--Switch-trackWidth': { xs: '36px', sm: '40px' },
                    '--Switch-trackHeight': { xs: '20px', sm: '24px' },
                  }}
                />
              </Box>

              <Button 
                onClick={handleCreate} 
                sx={{
                  ...buttonStyles(theme),
                  mt: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 1.5 },
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
              borderRadius: { xs: '15px', sm: '20px' },
              boxShadow: darkMode
                ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
                : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
              border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
              p: { xs: 2, sm: 3 },
              flex: { xs: 'none', lg: 1 },
              minHeight: { xs: '100px', sm: '120px', lg: '150px' },
            }}
          >
            <Typography sx={{ 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3 }, 
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}>
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
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      background: 'transparent',
                    },
                  }}
                />
              </Box>
              <Button 
                onClick={handleJoin} 
                sx={{
                  ...buttonStyles(theme),
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 1.5 },
                }}
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