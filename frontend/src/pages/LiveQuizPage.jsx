import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { GetErrorMessage } from '../utils/ErrorHandler';
import CountdownTimer from '../utils/Timer';
import Starbg from '../components/Starbg'
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Button,
} from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import ScorecardModal from '../components/ScoreBoardDialog';
import useWebSocketLive from '../hooks/useWebSocketLive';

export default function LiveQuizPage() {
  const [darkMode, setDarkMode] = useState(true);
  const optionKeys = ["OptionA", "OptionB", "OptionC", "OptionD"];
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [user_answer, setAnswer] = useState('');
  const [scoreSheet, setScoreSheet] = useState({});
  const ques_no = useRef(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;
  const { quizId } = useParams();
  const hasRun = useRef(false);
  const timerRef = useRef();
  const [quizRoom, setQuizRoom] = useState({});
  const [isHost, setHost] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [showEndButton, setShowEndButton] = useState(false);
  const hasTimeUpRun = useRef(false);
  const selectedAnswerRef = useRef('');

  const ws_url = `ws://localhost:8080/quizrooms/${quizId}/ws/live?token=${token}`;
  const [ socketRef, connected ] = useWebSocketLive(ws_url);

  useEffect(() => {

      if (hasRun.current || !connected) return;
      hasRun.current = true;

      axios.get(`http://localhost:8080/quizrooms/${quizId}/get-questions`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        setQuestions(response.data);
      })
      .catch(err => {
        toast.error(GetErrorMessage(err));
      });

      axios.get(`http://localhost:8080/quizrooms/${quizId}/lobby`, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        }
      })
      .then(response => {
      setHost(decoded.user_id === response.data.quizroom.Players[0].PlayerId);
      })
      .catch(err => {
        toast.error(GetErrorMessage(err));
      });

  }, [connected]);

  //for sending questions to WS
  useEffect(() => {
    const msg = {
      Type: 'questions',
      Msg: questions
    };
    if(questions.length) {
      sendMessage(JSON.stringify(msg));
    }
  },[questions, isHost]);

  //for getting messages from WS
  useEffect(() => {
    if (!socketRef.current) return;
    const handleMessage = (e) => {
      const data = JSON.parse(e.data);
      if(data.Type === 'question') {
        setShowScorecard(false);
        setQuestion(data.Msg);
        startTimer(5);
      } else if(data.Type === 'scorecard') {
        setScoreSheet(data.Msg);
      } else if(data.Type === 'last_question') {
        setShowScorecard(false);
        setQuestion(data.Msg);
        startTimer(5);
        setShowEndButton(true);
      }
    };

    socketRef.current.addEventListener('message', handleMessage);

    return () => {
      socketRef.current.removeEventListener('message', handleMessage);
    };
  }, [socketRef]);

  //for sending messages to WS
  const sendMessage = (msg) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
      console.log('sent: ',msg);
    } else {
      console.warn('Socket not open');
    }
  };

  const nextQuestion = () => {
    if(!isHost) return;
    const msg = {
      Type: 'next_question',
    };
    sendMessage(JSON.stringify(msg));
  };

  const handleQuizExit = () => {
    navigate('/quizrooms', { replace: true });
  }

  const handleTimeUp = () => {
    if (hasTimeUpRun.current) return; 
      hasTimeUpRun.current = true;
    toast.warning('Time Up!');
    const msg = {
      Type: 'answer',
      Msg:  { UserId: decoded.user_id,
              Answer: selectedAnswerRef.current
              }
    };
    sendMessage(JSON.stringify(msg));
    setShowScorecard(true);
  };

  const startTimer = (duration) => {
    hasTimeUpRun.current = false;
    if (timerRef.current) {
      timerRef.current.startTimer(duration);
    }
  };

  const handleSelect = (optionKey) => {
    setSelectedOption(prev => {
      if (prev === optionKey) {
        console.log(null);
        selectedAnswerRef.current = '';
        return null;
      } else {
        console.log(question[optionKey]);
        selectedAnswerRef.current = question[optionKey]
        return optionKey;
      }
    });
    console.log(selectedAnswerRef.current);
  };

  const getOptionStyles = (key) => {
    const isSelected = selectedOption === key;
    const muddyOrange = '#a1662f';

    return {
      background: isSelected ? muddyOrange : darkMode ? '#0d0d0d' : '#e0e0e0',
      boxShadow: isSelected
        ? darkMode
          ? '3px 3px 8px #000, -3px -3px 8px #1a1a1a'
          : '3px 3px 8px #c0c0c0, -3px -3px 8px #ffffff'
        : darkMode
        ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
        : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
      border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
      color: darkMode ? 'white' : 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: '0.1s',
    };
  };

  return (
    <Box sx={{
      position: 'absolute',
      inset: 0,
      background: darkMode ? '#1a1a1a' : '#f5f5f5',
      color: darkMode ? 'white' : 'black',
      fontFamily: 'Roboto, sans-serif',
      overflow: 'hidden',
      pb: 5,
    }}>

    <Starbg />
      <CountdownTimer ref={timerRef} onTimeUp={handleTimeUp} />
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        sx={{ position: 'absolute', top: 16, right: 16, color: darkMode ? 'white' : 'black', zIndex: 10 }}
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </IconButton>

      <Box sx={{ height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, textAlign: 'center', zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {question.Ques}
        </Typography>
      </Box>

      <Box sx={{ height: '50%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, p: 3, pb: 5, zIndex: 1 }}>
        {optionKeys.map((key) => (
          <Box
            key={key}
            onClick={() => handleSelect(key)}
            sx={{ borderRadius: '20px', ...getOptionStyles(key) }}
          >
            {key.replace("Option", "")}: {question[key]}
          </Box>
        ))}
      </Box>

        <Modal
          open={showScorecard}
          onClose={() => {}}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box
            sx={{
              width: '90%',
              height: '90%',
              bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5',
              color: darkMode ? 'white' : 'black',
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 2 }}>
              SCORES
            </Typography>

            {isHost && !showEndButton && <Button
              variant="contained"
              onClick={() => {
                nextQuestion();
              }}
              sx={{
                mt: 4,
                bgcolor: darkMode ? '#a1662f' : '#333',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1,
                '&:hover': {
                  bgcolor: darkMode ? '#864d24' : '#555',
                },
              }}
            >
              Next
            </Button>}
            {showEndButton && <Button
              variant="contained"
              onClick={() => {
                handleQuizExit();
              }}
              sx={{
                mt: 4,
                bgcolor: darkMode ? '#a1662f' : '#333',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1,
                '&:hover': {
                  bgcolor: darkMode ? '#864d24' : '#555',
                },
              }}
            >
              EXIT
            </Button>}
          </Box>
        </Modal>

    </Box>
  );
}