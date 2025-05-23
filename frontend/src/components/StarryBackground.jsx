import React from 'react';
import { Box } from '@mui/material';

const StarryBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)',
      backgroundPosition: '0 0, 25px 25px',
      backgroundSize: '50px 50px',
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.2,
    }}
  />
);

export default StarryBackground;
