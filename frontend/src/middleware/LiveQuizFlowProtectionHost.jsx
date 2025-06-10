import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from "../config";
import { jwtDecode } from 'jwt-decode';

const LiveFlowProtectedRouteHost = ({ children, currentPage }) => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [isChecking, setIsChecking] = useState(true);
  const [isHost, setHost] = useState(false);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch(`${BASE_URL}/quizrooms/${quizId}/lobby`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
          }
        });
        
        const result = await response.json();
        setHost(decoded.user_id === result.quizroom.Players[0].PlayerId);

        if(decoded.user_id === result.quizroom.Players[0].PlayerId) {
            console.log(`Access granted for page: ${currentPage}`);
        } else if (result.quizroom.IsRunnning){
            console.log(`Access granted for page: ${currentPage}`);
        } else {
            console.log(`Access denied. Redirecting back`);
            navigate(-1, { replace: true });
        }
      } catch (error) {
        console.error('Flow protection check failed:', error);
        navigate(-1,  { replace: true });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAccess();
  }, [quizId, currentPage, navigate]);
  
  // Show loading while checking access
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Checking access...</div>
      </div>
    );
  }
  
  return children;
};

export default LiveFlowProtectedRouteHost;