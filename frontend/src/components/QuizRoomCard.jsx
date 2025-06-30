import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import { buttonStyles } from '../components/DarkButton';
import {
  Timer,
  People,
  Quiz,
  PlayArrow,
  SportsEsports,
  Circle,
  FiberManualRecord,
  ChevronRight,
  SignalCellularAlt,
  Battery90,
  Wifi,
  MoreHoriz
} from '@mui/icons-material';


const CompactCard = ({ room, handleCardJoin }) => {
  return (
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
                      QuizRoom #{room.QuizRoomId}
                    </Typography>
                    <Divider sx={{ my: 1, background: '#444' }} />
                    <Typography variant="body2">⏱ Time: {room.TimerTime}s</Typography>
                    <Typography variant="body2">📘 Topic: {room.QuizTopic}</Typography>
                    <Typography variant="body2">📘 Players: {room.Players.length}</Typography>
                    <Typography variant="body2">📘 Questions: {room.PlayersAnswers[0]}</Typography>
                    <Typography variant="body2">
                      🔄 Status: {room.IsRunnning ? 'Quizzing' : 'Lobby'}
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
};

export default CompactCard;
