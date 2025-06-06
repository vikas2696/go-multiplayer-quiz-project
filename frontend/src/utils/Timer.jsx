import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

const CountdownTimer = forwardRef(({ onTimeUp }, ref) => {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const intervalRef = useRef(null);

  const startTimer = (seconds) => {
    clearInterval(intervalRef.current);
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

  return (
    secondsLeft !== null && (
      <div style={{ position: 'absolute', top: 20, right: 60, fontSize: '24px' }}>
        {secondsLeft}
      </div>
    )
  );
});

export default CountdownTimer;
