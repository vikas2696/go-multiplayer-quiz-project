import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from "../config";
import { textFieldStyles } from '../components/EmbeddedTextField';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  useTheme,
  Divider,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Starbg from '../components/Starbg';
import { buttonStyles } from '../components/DarkButton'
import axios from 'axios';
import { GetErrorMessage } from '../utils/ErrorHandler';
import { jwtDecode } from 'jwt-decode';
import handleUnload from '../utils/UnloadHandler';
import { useBackButtonConfirmation } from '../utils/useBackButtonConfirmation'
import useWebSocket from '../hooks/useWebSocket';

export default function LobbyPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isHost, setHost] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [quizRoom, setQuizRoom] = useState({});
  const hasRun = useRef(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const { quizId } = useParams();

  const leaveRoom_endpoint = `${config.BASE_URL}/quizrooms/${quizId}/leave`;
  const ws_url = `${config.BASE_WS_URL}/quizrooms/${quizId}/ws/lobby?token=${token}`;

  const { showConfirm, handleConfirmLeave, handleStay } = useBackButtonConfirmation(leaveRoom_endpoint, token);
  const socketRef = useWebSocket(ws_url);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [reloadLobby, setReloadLobby] = useState('');

  // Scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    axios.get(`${config.BASE_URL}/quizrooms/`+ quizId +'/lobby',
      {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
      })
      .then(response => {
        setQuizRoom(response.data.quizroom);
        setHost(decoded.user_id === response.data.quizroom.Players[0].PlayerId);
      })
      .catch(err => {
        toast.error(GetErrorMessage(err));
        navigate('/quizrooms');
      });

  }, [reloadLobby]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleMessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
        if (data.Type === 'join') {
          setMessages(prev => [...prev, data.Msg.Username+' entered the lobby.']);
          setReloadLobby('joined');
        } else if(data.Type === 'leave') {
          setMessages(prev => [...prev, data.Msg.Username+' left the lobby.']);
          setReloadLobby('left');
        } else if(data.Type === 'start') {
          navigate(`/quizrooms/${quizId}/live`, { state: { skipProtection: true } });
        } else if(data.Type === 'chat'){
          setMessages(prev => [...prev, data.Msg.Username+': '+data.Msg.Chat]);
        }
    };

    socketRef.current.addEventListener('message', handleMessage);

    return () => {
      socketRef.current.removeEventListener('message', handleMessage);
    };
  }, [socketRef]);

  const sendMessage = (msg) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.warn('Socket not open');
    }
  };

  const handleStartQuiz = () => {
    const msg = {
      Type: 'start',
      Msg: { PlayerId: decoded.user_id, Username: decoded.username }
    };
    //console.log(msg);
    sendMessage(JSON.stringify(msg));
    //navigate('/live');
  };

  const handleLeavePressed = () => {
    const msg = {
      Type: 'leave',
      Msg: { PlayerId: decoded.user_id, Username: decoded.username }
    };
    //console.log(msg);
    sendMessage(JSON.stringify(msg));
    handleConfirmLeave();
  }

  const handleSend = () => {
     const msg = {
      Type: 'chat',
      Msg: { Username: decoded.username, Chat: chatMessage }
    };
    //console.log(msg);
    setChatMessage('');
    sendMessage(JSON.stringify(msg));
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && chatMessage.trim()) {
      handleSend();
    }
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
        overflow: 'hidden',
      }}
    >
      <Starbg />

       {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Leave Room?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave the room?.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleLeavePressed}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                Yes, Leave
              </button>
              <button
                onClick={handleStay}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}

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
        <Typography variant="h4" sx={{ fontWeight: 700, zIndex: 1 }}>
          Quiz Lobby
        </Typography>
        
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            color: darkMode ? 'white' : 'black',
            zIndex: 10,
          }}
          aria-label="Toggle light/dark mode"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </IconButton>
      </Box>

      {/* Main Content - Two Column Layout on Desktop */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          px: 2, 
          pb: 2,
          overflow: 'hidden',
          minHeight: 0
        }}
      >
        {/* Left Column - Room Info */}
        <Box
          sx={{
            width: { xs: '100%', md: '400px' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
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
          </Box>

          {isHost && (
            <Button
              onClick={handleStartQuiz}
              variant="contained"
              color="primary"
              sx={buttonStyles(theme)}
            >
              Start Quiz
            </Button>
          )}
        </Box>

        {/* Right Column - Chat */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: darkMode ? '#0d0d0d' : '#e0e0e0',
            borderRadius: '20px',
            boxShadow: darkMode
              ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
              : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
            border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
            overflow: 'hidden',
            minHeight: { xs: '300px', md: 'auto' },
          }}
        >
          {/* Chat Header */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${darkMode ? '#222' : '#ccc'}` }}>
            <Typography sx={{ fontWeight: 600 }}>Chat</Typography>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              minHeight: 0,
            }}
          >
            {messages.length === 0 ? (
              <Typography sx={{ color: darkMode ? '#666' : '#999', fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
                No messages yet...
              </Typography>
            ) : (
              messages.map((msg, idx) => (
                <Typography key={idx} sx={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                  {msg}
                </Typography>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Chat Input */}
          <Box sx={{ p: 2, borderTop: `1px solid ${darkMode ? '#222' : '#ccc'}` }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={textFieldStyles(darkMode)}>
                <TextField
                  fullWidth
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="standard"
                  placeholder="Type a message..."
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
              <Button onClick={handleSend} sx={buttonStyles(theme)}>SEND</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box> 
  );
}