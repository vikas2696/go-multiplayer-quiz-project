import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from "../config";
import { jwtDecode } from 'jwt-decode';

const FlowProtectedRoute = ({ children, currentPage }) => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/quizrooms/${quizId}/check-page-access`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
          }
        });
        
        const result = await response.json();
        
        if (!result.allowed) {
          console.log(`Access denied. Redirecting to: ${result.redirectTo}`);
          navigate(result.redirectTo || '/quizrooms');
        } else {
          console.log(`Access granted for page: ${currentPage}`);
        }
      } catch (error) {
        console.error('Flow protection check failed:', error);
        navigate('/quizrooms', { replace: true });
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

export default FlowProtectedRoute;