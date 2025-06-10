import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProtectedRoute from './middleware/AuthProtectionRoute'
import FlowProtectedRoute from './middleware/FlowProtectionRoute'
import LiveFlowProtectedRouteHost from './middleware/LiveQuizFlowProtectionHost';
import Signup from './pages/Signup';
import Dashboard from './pages/Dasboard'
import QuizRooms from './pages/QuizRoomsPage'
import LobbyPage from './pages/LobbyPage'
import LivePage from './pages/LiveQuizPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        
        <Route path="/quizrooms" element={
          <AuthProtectedRoute>
            <QuizRooms />
          </AuthProtectedRoute>
        }/>
        
        <Route path="/quizrooms/:quizId/lobby" element={
          <AuthProtectedRoute>
            <FlowProtectedRoute currentPage="lobby">
              <LobbyPage />
            </FlowProtectedRoute>
          </AuthProtectedRoute>
        } />
        
        <Route path="/quizrooms/:quizId/live" element={
          <AuthProtectedRoute>
            <FlowProtectedRoute>
              <LiveFlowProtectedRouteHost currentPage="live">
              <LivePage />
              </LiveFlowProtectedRouteHost>
            </FlowProtectedRoute>
          </AuthProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
