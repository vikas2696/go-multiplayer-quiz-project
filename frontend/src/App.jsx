import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/AuthProtectionRoute'
import Signup from './pages/Signup';
import Dashboard from './pages/Dasboard'
import QuizRooms from './pages/QuizRoomsPage'
import LobbyPage from './pages/LobbyPage'
import LivePage from './pages/LiveQuizPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router basename="/go-multiplayer-quiz-project">
      <Routes>        
        <Route path="/" element={<Signup />} />  
        <Route path="/quizrooms" element={
          <ProtectedRoute> <QuizRooms /></ProtectedRoute>
          }/>
        <Route path="/quizrooms/:quizId/lobby" element={
          <ProtectedRoute> <LobbyPage /></ProtectedRoute>
          } />  
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/quizrooms/:quizId/live" element={
          <ProtectedRoute> <LivePage /></ProtectedRoute>
          } />  
      </Routes>
      <ToastContainer />
    </Router>
    
  );
}

export default App;
