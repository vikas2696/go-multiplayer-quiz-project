import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { GetErrorMessage } from '../utils/ErrorHandler';
import CountdownTimer from '../utils/Timer';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import ScorecardModal from '../components/ScoreBoardDialog';

export default function LiveQuizPage() {
  const [darkMode, setDarkMode] = useState(true);
  const optionKeys = ["OptionA", "OptionB", "OptionC", "OptionD"];
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [user_answer, setAnswer] = useState('');
  const [scoreSheet, setScoreSheet] = useState({});
  const ques_no = useRef(0);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;
  const { quizId } = useParams();
  const hasRun = useRef(false);
  const timerRef = useRef();
  const [quizRoom, setQuizRoom] = useState({});
  const [isHost, setHost] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    axios.get(`http://localhost:8080/quizrooms/${quizId}/get-questions`, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        setQuestions(response.data);
        ques_no.current = 0;
        setQuestion(response.data[0]);
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
      setQuizRoom(response.data.quizroom);
      setScoreSheet(response.data.quizroom.ScoreSheet)
      setHost(decoded.user_id === response.data.quizroom.Players[0].PlayerId);
      })
      .catch(err => {
        toast.error(GetErrorMessage(err));
      });

  }, []);

  useEffect(() => {
    if (question && question.Ques) {
      
      startTimer(10);
    }
  }, [question]);

  const startTimer = (duration) => {
    if (timerRef.current) {
      timerRef.current.startTimer(duration);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setAnswer('');

    console.log("Current question index:", ques_no.current);
    console.log("Total questions:", questions.length);

    if (ques_no.current < questions.length - 1) {
      ques_no.current += 1;
      setQuestion(questions[ques_no.current]);
      console.log("Moved to question:", questions[ques_no.current]);
    } else {
      console.log("No more questions");
      toast.success("Quiz complete!");
    }
  };

  useEffect(() => {
      axios.post(`http://localhost:8080/quizrooms/${quizId}/save-answer`, 
      user_answer , {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        toast.success(response.data.message+' '+question[selectedOption])
      })
      .catch(err => {
        toast.error(GetErrorMessage(err));
      });
  }, [user_answer]);

  const handleTimeUp = () => {
    toast.warning('Time is up!');
     axios.get(`http://localhost:8080/quizrooms/${quizId}/lobby`, 
     {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log(response.data.quizroom.PlayersAnswers)
        setScoreSheet(updateScorecard(response.data.quizroom.Players,
          response.data.quizroom.PlayersAnswers,
          question.Answer,
          scoreSheet
        ));
        setShowScorecard(true);
      })
      .catch(err => {
        toast.error(GetErrorMessage(err));
      });
    //nextQuestion();
  };

  function updateScorecard(players, playersAnswers, correctAnswer, scorecard) {
    players.forEach(player => {
      const { PlayerId, Username } = player;
      const selectedAnswer = playersAnswers[PlayerId];
      const isCorrect = selectedAnswer === correctAnswer;

      // Initialize player in scorecard if not present
      if (!scorecard[PlayerId]) {
        scorecard[PlayerId] = {
          username: Username,
          score: 0,
        };
      }

      // Update score if correct
      if (isCorrect) {
        scorecard[PlayerId].score += 1;
      }

      // Optionally store last answer and correctness (for frontend display)
      scorecard[PlayerId].selectedAnswer = selectedAnswer || null;
      scorecard[PlayerId].isCorrect = isCorrect;
    });

    return scorecard;
  }


  const handleSelect = (optionKey) => {
    setSelectedOption(prev => {
      if (prev === optionKey) {
        setAnswer(null);
        return null;
      } else {
        setAnswer(question[optionKey]);
        return optionKey;
      }
    });
  };

  const handleNextQuestion = () => {
    //not yet
  }

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

  const symbols = ['atom', 'rocket', 'microscope', 'flask-conical', 'telescope'];
  const symbolPositions = [
    { top: '10%', left: '20%' },
    { top: '30%', right: '25%' },
    { bottom: '20%', left: '15%' },
    { bottom: '10%', right: '20%' },
    { top: '50%', left: '50%' },
  ];

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    duration: Math.random() * 2 + 1,
  }));

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
      {stars.map((star) => (
        <motion.div key={star.id} initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: star.duration, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: star.top, left: star.left, width: star.size, height: star.size, backgroundColor: 'white', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }}
        />
      ))}

      <CountdownTimer ref={timerRef} onTimeUp={handleTimeUp} />
      <ScorecardModal
      open={showScorecard}
      onClose={() => setShowScorecard(false)}
      scorecard={scoreSheet}
      correctAnswer={question.Answer}
      isHost={isHost}
      onNextQuestion={handleNextQuestion}
    />
      {symbols.map((symbol, i) => (
        <motion.div key={i} initial={{ y: 0 }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut' }}
          style={{ position: 'absolute', fontSize: '1.5rem', color: 'rgba(255,255,255,0.1)', pointerEvents: 'none', zIndex: 0, ...symbolPositions[i] }}
        >
          <i className={`lucide lucide-${symbol}`} />
        </motion.div>
      ))}

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
    </Box>
  );
}