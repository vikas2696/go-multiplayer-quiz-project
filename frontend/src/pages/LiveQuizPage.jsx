import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { GetErrorMessage } from '../utils/ErrorHandler';
import CountdownTimer from '../utils/Timer';
import Starbg from '../components/Starbg'
import config from "../config";
import { buttonStyles } from '../components/DarkButton';
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Button,
  useTheme,
} from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import SplitScoreboard from '../components/ScoreSheetDesign'
import useWebSocketLive from '../hooks/useWebSocketLive';

export default function LiveQuizPage() {
  const theme = useTheme();
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

  const ws_url = `${config.BASE_WS_URL}/quizrooms/${quizId}/ws/live?token=${token}`;
  const [ socketRef, connected ] = useWebSocketLive(ws_url);

  useEffect(() => {

      if (hasRun.current || !connected) return;
      hasRun.current = true;

      axios.get(`${config.BASE_URL}/quizrooms/${quizId}/get-questions`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        setQuestions(response.data);
        //console.log(response.data)
      })
      .catch(err => {
        toast.error(GetErrorMessage(err));
      });

      axios.get(`${config.BASE_URL}/quizrooms/${quizId}/lobby`, {
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

  //for receiving messages from WS
  useEffect(() => {
    if (!socketRef.current) return;
    const handleMessage = (e) => {
      const data = JSON.parse(e.data);
      if(data.Type === 'question') {
        setShowScorecard(false);
        setQuestion(data.Msg.Question);
        startTimer(data.Msg.Timer);
      } else if(data.Type === 'scorecard') {
        setScoreSheet(data.Msg);
      } else if(data.Type === 'last_question') {
        setShowScorecard(false);
        setQuestion(data.Msg.Question);
        startTimer(data.Msg.Timer);
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
      //console.log('sent: ',msg);
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
    if(isHost) {
      axios.delete(`${config.BASE_URL}/quizrooms/${quizId}/delete`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        navigate('/quizrooms', { replace: true });
        toast.success('Quizroom deleted!');
      })
      .catch(err => {
        console.log(GetErrorMessage(err));
      });
    } else {
      navigate('/quizrooms', { replace: true });
    }
  }

  const handleTimeUp = () => {
    if (hasTimeUpRun.current) return; 
      hasTimeUpRun.current = true;
    //toast.warning('Time Up!');
    const msg = {
      Type: 'answer',
      Msg:  { UserId: decoded.user_id,
              Answer: selectedAnswerRef.current
              }
    };
    sendMessage(JSON.stringify(msg));
    setSelectedOption(null);
    selectedAnswerRef.current = '';
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
        //console.log(null);
        selectedAnswerRef.current = '';
        return null;
      } else {
        //console.log(question[optionKey]);
        selectedAnswerRef.current = question[optionKey]
        return optionKey;
      }
    });
    //console.log(selectedAnswerRef.current);
  };

  const getOptionStyles = (key) => {
    const isSelected = selectedOption === key;
    const muddyOrange = '#a1662f';

    return {
      background: isSelected ? '#318CE7' : darkMode ? '#0d0d0d' : '#e0e0e0',
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

      {/* Question box */}
        <Box
          sx={{
            height: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                border: '1px solid',
                borderColor: '#58a6ff',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                mt: 1,
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
            <Typography sx={{ color: '#58a6ff' }}>
              Question #{question.QuestionId}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {question.Ques}
          </Typography>
        </Box>

      {/* Options box */}
      <Box sx={{ height: '50%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, p: 3, pb: 5, zIndex: 1 }}>
        {optionKeys.map((key) => (
        <Box
          key={key}
          onClick={() => handleSelect(key)}
          sx={{
            borderRadius: '16px',
            py: 2,
            px: 3,
            textAlign: 'center',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '1rem',
            transition: 'all 0.2s ease-in-out',
            ...getOptionStyles(key),
            '&:hover': {
              boxShadow: darkMode ? '0 0 6px #ffffff33' : '0 0 6px #00000022',
              transform: 'scale(1.01)',
            },
          }}
        >
          {question[key]}
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
            <Starbg />
            <SplitScoreboard 
              scoreSheet={scoreSheet.ScoreSheet} 
              question={scoreSheet.Question}
              darkMode={darkMode} 
            />

            {isHost && !showEndButton && <Button
              variant="contained"
              onClick={() => {
                nextQuestion();
              }}
                sx={{
                  ...buttonStyles(theme),
                  width: 150,
                  height: 45,
                  fontSize: '0.85rem',
                  p:1,
                  m: 2,
                }}
            >
              Next Question
            </Button>}
            {showEndButton && <Button
              variant="contained"
              onClick={() => {
                handleQuizExit();
              }}
              sx={{
                  ...buttonStyles(theme),
                  width: 150,
                  height: 45,
                  fontSize: '0.85rem',
                  p:1,
                  m: 2,
              }}
            >
              EXIT
            </Button>}
          </Box>
        </Modal>

    </Box>
  );
}
