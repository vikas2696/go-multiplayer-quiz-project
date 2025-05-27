import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

const Starbg = () => {
  const stars = useMemo(() => (
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: Math.random() * 2 + 1,
    }))
  ), []);

  return (
    <>
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
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
};

export default Starbg;