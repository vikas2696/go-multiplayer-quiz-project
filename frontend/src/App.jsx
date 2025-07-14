import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProtectedRoute from './middleware/AuthProtectionRoute'
import FlowProtectedRoute from './middleware/FlowProtectionRoute'
import LiveFlowProtectedRouteHost from './middleware/LiveQuizFlowProtectionHost';
import Signup from './pages/Signup';
import QuizAgent from './pages/QuizAgent'
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
        
        <Route path="/quizrooms/quiz-agent" element={
          <AuthProtectedRoute>
            <QuizAgent />
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
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: 'rgba(18, 18, 18, 0.75)',
            color: '#e0e0e0',
            border: '1px solid #2a2a2a',
            borderRadius: '16px',
            fontFamily: 'monospace',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '12px 18px',
            fontSize: '0.85rem',
            lineHeight: 1,
          }}
          progressStyle={{
            background: '#58a6ff',
            height: '4px',
            borderRadius: '0 0 10px 10px',
          }}
        />
    </Router>
  );
}

export default App;
