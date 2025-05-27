import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

const Starbg = () => {
  const stars = useMemo(() => (
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.8 + 0.2,
    }))
  ), []);

  const cockpitElements = useMemo(() => (
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      side: i < 3 ? 'left' : 'right',
      top: `${20 + (i % 3) * 25}%`,
      width: `${Math.random() * 40 + 60}px`,
      height: `${Math.random() * 20 + 30}px`,
    }))
  ), []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-black"></div>
      
      {/* Streaming stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
          animate={{
            x: [0, window.innerWidth * 1.5],
            scale: [1, 0.5, 0],
            opacity: [star.opacity, star.opacity * 0.7, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Cockpit frame - top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-400/60 rounded-full blur-sm"></div>
      </div>

      {/* Cockpit frame - sides */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-900 via-gray-800/60 to-transparent">
        {cockpitElements.filter(el => el.side === 'left').map((element) => (
          <motion.div
            key={element.id}
            className="absolute bg-gradient-to-r from-blue-500/40 to-cyan-400/40 rounded-r-lg border-r border-blue-400/30"
            style={{
              top: element.top,
              left: '10px',
              width: element.width,
              height: element.height,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent to-blue-400/20 rounded-r-lg"></div>
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-900 via-gray-800/60 to-transparent">
        {cockpitElements.filter(el => el.side === 'right').map((element) => (
          <motion.div
            key={element.id}
            className="absolute bg-gradient-to-l from-blue-500/40 to-cyan-400/40 rounded-l-lg border-l border-blue-400/30"
            style={{
              top: element.top,
              right: '10px',
              width: element.width,
              height: element.height,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-to-l from-transparent to-blue-400/20 rounded-l-lg"></div>
          </motion.div>
        ))}
      </div>

      {/* Cockpit frame - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-blue-400/40 rounded-full blur-sm"></div>
        
        {/* Control panel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Distant nebula effect */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Engine glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Starbg;