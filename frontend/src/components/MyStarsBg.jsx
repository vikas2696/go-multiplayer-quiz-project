import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const PageBackground = ({ children, darkMode = false }) => {
  // Simple background with animated stars or plain bg
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: star.duration, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      ))}
      {children}
    </Box>
  );
};

export default PageBackground;
