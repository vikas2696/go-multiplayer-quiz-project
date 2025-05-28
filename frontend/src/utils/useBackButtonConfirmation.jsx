import { useEffect, useState, useRef } from 'react';
import handleUnload from './UnloadHandler';
import { useNavigate } from 'react-router-dom';

export const useBackButtonConfirmation = (leaveRoom_endpoint, token) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const hasSetupRef = useRef(false);
  
  useEffect(() => {
    // Prevent multiple setups
    if (hasSetupRef.current) return;
    
    let isHistorySetup = false;
    
    const setupHistoryState = () => {
      if (!isHistorySetup) {
        // Check if we already have a preventBack state
        if (!window.history.state?.preventBack) {
          window.history.pushState({ preventBack: true, timestamp: Date.now() }, '', window.location.href);
        }
        isHistorySetup = true;
      }
    };
    
    // Setup immediately
    setupHistoryState();
    
    const handlePopState = (event) => {
      console.log('Popstate triggered:', event.state);
      
      // If we detect any back navigation, show confirmation
      setShowConfirm(true);
      
      // Immediately prevent the navigation by pushing state again
      window.history.pushState({ preventBack: true, timestamp: Date.now() }, '', window.location.href);
    };
    
    // Handle page load/refresh - setup history state when page becomes visible
    const handlePageShow = (event) => {
      console.log('Page show event:', event.persisted);
      if (!isHistorySetup) {
        setTimeout(setupHistoryState, 100);
      }
    };
    
    // Handle visibility change (additional fallback for mobile)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isHistorySetup) {
        setTimeout(setupHistoryState, 100);
      }
    };
    
    // Handle beforeunload for tab close (no dialog, just leave)
    const handleBeforeUnload = (event) => {
      console.log('Before unload triggered');
      fetch(leaveRoom_endpoint, {
      method: 'PATCH',
      headers: {
        'Authorization': token,
      },
        keepalive: true,
      });
    };
    
    // Add all event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    hasSetupRef.current = true;
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      hasSetupRef.current = false;
    };
  }, [leaveRoom_endpoint, token]);

  const handleConfirmLeave = async () => {
    setShowConfirm(false);
    
    try {
      await handleUnload(leaveRoom_endpoint, 'PATCH', token);
    } catch (error) {
      console.error('Failed to leave room:', error);
    } finally {
      // Navigate regardless of API success/failure
      navigate('/quizrooms', { replace: true });
    }
  };

  const handleStay = () => {
    setShowConfirm(false);
    // Make sure we still have our history state
    if (!window.history.state?.preventBack) {
      window.history.pushState({ preventBack: true, timestamp: Date.now() }, '', window.location.href);
    }
  };

  return { showConfirm, handleConfirmLeave, handleStay };
};