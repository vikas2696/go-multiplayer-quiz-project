import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

// Cartoon Planet Components with click interaction
const CartoonPlanet = ({ type, style, onClick }) => {
  const planetStyles = {
    mercury: {
      background: 'radial-gradient(circle at 30% 30%, #D4B896, #8C7853)',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    venus: {
      background: 'radial-gradient(circle at 30% 30%, #FFB347, #FFC649)',
      width: '9px',
      height: '9px',
      borderRadius: '50%',
    },
    earth: {
      background: 'radial-gradient(circle at 30% 30%, #2196F3, #4CAF50)',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
    },
    mars: {
      background: 'radial-gradient(circle at 30% 30%, #FF6347, #CD5C5C)',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    jupiter: {
      background: 'radial-gradient(circle at 30% 30%, #FF8C00, #D2691E)',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
    },
    saturn: {
      background: 'radial-gradient(circle at 30% 30%, #FFEBB7, #FAD5A5)',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
    },
    uranus: {
      background: 'radial-gradient(circle at 30% 30%, #3FC1C9, #4FD0E7)',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    neptune: {
      background: 'radial-gradient(circle at 30% 30%, #1E90FF, #4169E1)',
      width: '11px',
      height: '11px',
      borderRadius: '50%',
    },
    moon: {
      background: 'radial-gradient(circle at 30% 30%, #A9A9A9, #C0C0C0)',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
    },
    galaxy: {
      background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(138,43,226,0.4) 50%, transparent 70%)',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
    },
    nebula: {
      background: 'radial-gradient(circle, rgba(255,20,147,0.6) 0%, rgba(75,0,130,0.3) 60%, transparent 80%)',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
    },
    comet: {
      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(173,216,230,0.6))',
      width: '3px',
      height: '3px',
      borderRadius: '50%',
    },
    asteroid: {
      background: 'radial-gradient(circle at 30% 30%, #A9A9A9, #696969)',
      width: '2px',
      height: '2px',
      borderRadius: '50%',
    }
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 4px rgba(255,255,255,0.1)',
        cursor: 'pointer',
        ...planetStyles[type],
        ...style
      }}
    />
  );
};

// Floating Planets Component
const FloatingPlanets = () => {
  const [pathOffsets, setPathOffsets] = useState({});

  const handlePlanetClick = (planetIndex) => {
    setPathOffsets(prev => ({
      ...prev,
      [planetIndex]: (prev[planetIndex] || 0) + 20
    }));
  };

  const celestialBodies = [
    { name: 'mercury', type: 'mercury', orbitRadius: 80, orbitSpeed: 80, startAngle: 0 },
    { name: 'venus', type: 'venus', orbitRadius: 110, orbitSpeed: 120, startAngle: 60 },
    { name: 'earth', type: 'earth', orbitRadius: 140, orbitSpeed: 150, startAngle: 120 },
    { name: 'moon', type: 'moon', orbitRadius: 20, orbitSpeed: 25, startAngle: 0, parent: 'earth' },
    { name: 'mars', type: 'mars', orbitRadius: 170, orbitSpeed: 200, startAngle: 180 },
    { name: 'jupiter', type: 'jupiter', orbitRadius: 220, orbitSpeed: 300, startAngle: 240 },
    { name: 'saturn', type: 'saturn', orbitRadius: 270, orbitSpeed: 400, startAngle: 300 },
    { name: 'uranus', type: 'uranus', orbitRadius: 310, orbitSpeed: 500, startAngle: 20 },
    { name: 'neptune', type: 'neptune', orbitRadius: 350, orbitSpeed: 600, startAngle: 80 },
    { name: 'galaxy1', type: 'galaxy', orbitRadius: 400, orbitSpeed: 1000, startAngle: 45 },
    { name: 'galaxy2', type: 'galaxy', orbitRadius: 450, orbitSpeed: 1200, startAngle: 225 },
    { name: 'nebula1', type: 'nebula', orbitRadius: 380, orbitSpeed: 800, startAngle: 315 },
    { name: 'nebula2', type: 'nebula', orbitRadius: 420, orbitSpeed: 900, startAngle: 135 },
    { name: 'comet1', type: 'comet', orbitRadius: 200, orbitSpeed: 100, startAngle: 30 },
    { name: 'comet2', type: 'comet', orbitRadius: 330, orbitSpeed: 200, startAngle: 210 },
    { name: 'asteroid1', type: 'asteroid', orbitRadius: 150, orbitSpeed: 90, startAngle: 270 },
    { name: 'asteroid2', type: 'asteroid', orbitRadius: 190, orbitSpeed: 110, startAngle: 90 },
    { name: 'asteroid3', type: 'asteroid', orbitRadius: 160, orbitSpeed: 95, startAngle: 150 }
  ];

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      {celestialBodies.map((body, i) => {
        const pathOffset = pathOffsets[i] || 0;
        return (
          <motion.div
            key={i}
            initial={{ rotate: body.startAngle }}
            animate={{ rotate: body.startAngle + 360 + pathOffset }}
            transition={{
              rotate: {
                repeat: Infinity,
                duration: body.orbitSpeed,
                ease: 'linear',
              }
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: body.orbitRadius * 2,
              height: body.orbitRadius * 2,
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto',
              }}
            >
              <CartoonPlanet
                type={body.type}
                onClick={() => handlePlanetClick(i)}
              />
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default FloatingPlanets;
