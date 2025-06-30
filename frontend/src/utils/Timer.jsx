import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

const CountdownTimer = forwardRef(({ onTimeUp }, ref) => {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const intervalRef = useRef(null);

  const startTimer = (seconds) => {
    clearInterval(intervalRef.current);

    if (seconds <= 0) {
      setSecondsLeft(0);
      if (onTimeUp) onTimeUp();
      return;
    }

    setSecondsLeft(seconds);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        const next = prev - 1;
        if (next === 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimeout(() => {
            if (onTimeUp) onTimeUp(); // ✅ Now safe
          }, 0);
        }
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useImperativeHandle(ref, () => ({
    startTimer,
    stopTimer,
  }));

    const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    secondsLeft !== null && (
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 60,
          minWidth: '80px',
          height: '45px',
          background: '#0d0d0d',
          boxShadow: 'inset 4px 4px 8px #000000, inset -4px -4px 8px #1a1a1a',
          border: '1px solid #222',
          color: '#ffffff',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          padding: '6px 16px',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {formatTime(secondsLeft)}
      </div>


    )
  );
});

export default CountdownTimer;
