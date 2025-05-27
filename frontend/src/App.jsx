import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute'
import Signup from './pages/Signup';
import Dashboard from './pages/Dasboard'
import QuizRooms from './pages/QuizRoomsPage'
import LobbyPage from './pages/LobbyPage'
import LivePage from './pages/LiveQuizPage'

function App() {
  return (
    <Router>
      <Routes>        
        <Route path="/" element={<Signup />} />  
        <Route path="/quizrooms" element={
          <ProtectedRoute> <QuizRooms /></ProtectedRoute>
          }/>
        <Route path="/quizrooms/:quizId/lobby" element={
          <ProtectedRoute> <LobbyPage /></ProtectedRoute>
          } />  
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/live" element={<LivePage />} />  
      </Routes>
    </Router>
  );
}

export default App;
