import React from 'react';
import { Box, Typography } from '@mui/material';

const NeumorphicScoreboard = ({ scoreSheet, question, darkMode = true }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      maxHeight: '70%', 
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 0'
    }}>
      {/* Title */}
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          mb: 3,
          color: darkMode ? '#e0e0e0' : '#333',
          textAlign: 'center',
          letterSpacing: '1px'
        }}
      >
        SCORES
      </Typography>

      {/* Current Question Display */}
      {question && (
        <Box sx={{ 
          width: '100%', 
          maxWidth: '600px',
          mb: 4,
          textAlign: 'center'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#888' : '#666',
              mb: 1,
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Question #{question.QuestionId}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: darkMode ? '#b0b0b0' : '#555',
              mb: 2,
              fontSize: '0.9rem',
              fontWeight: 400,
              lineHeight: 1.3
            }}
          >
            {question.Ques}
          </Typography>

          <Typography 
            variant="caption" 
            sx={{ 
              color: darkMode ? '#666' : '#888',
              fontSize: '0.7rem',
              fontStyle: 'italic'
            }}
          >
            Answer: {question.Answer}
          </Typography>
        </Box>
      )}

      {/* Scoreboard Container */}
      <Box sx={{ 
        width: '100%', 
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        {scoreSheet && Object.entries(scoreSheet)
          .sort(([,a], [,b]) => b.CurrentScore - a.CurrentScore)
          .map(([id, player], index) => (
            <Box 
              key={id} 
              sx={{ 
                position: 'relative',
                background: darkMode ? '#1a1a1a' : '#f0f0f0',
                borderRadius: '20px',
                padding: '24px',
                // Neumorphic shadow effect
                boxShadow: darkMode 
                  ? 'inset 8px 8px 16px #0d0d0d, inset -8px -8px 16px #262626, 4px 4px 12px #000000'
                  : 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff, 4px 4px 12px rgba(0,0,0,0.1)',
                border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode 
                    ? 'inset 6px 6px 12px #0d0d0d, inset -6px -6px 12px #262626, 6px 6px 18px #000000'
                    : 'inset 6px 6px 12px #d1d1d1, inset -6px -6px 12px #ffffff, 6px 6px 18px rgba(0,0,0,0.15)',
                }
              }}
            >
              {/* Rank Badge */}
              <Box sx={{
                position: 'absolute',
                top: '-12px',
                left: '24px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: darkMode ? '#1a1a1a' : '#f0f0f0',
                boxShadow: darkMode 
                  ? '6px 6px 12px #0d0d0d, -6px -6px 12px #262626'
                  : '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: index === 0 ? '#ffd700' : 
                       index === 1 ? '#c0c0c0' : 
                       index === 2 ? '#cd7f32' : 
                       darkMode ? '#a1662f' : '#666',
                border: `2px solid ${darkMode ? '#333' : '#ddd'}`
              }}>
                #{index + 1}
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 1
              }}>
                {/* Player Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: darkMode ? '#e0e0e0' : '#333',
                      mb: 1
                    }}
                  >
                    {player.Username}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? '#a0a0a0' : '#666',
                      fontSize: '0.9rem'
                    }}
                  >
                    Answer: <span style={{ 
                      fontWeight: 500,
                      color: player.CurrentAnswer ? (darkMode ? '#a1662f' : '#d4af37') : '#999'
                    }}>
                      {player.CurrentAnswer || 'No answer'}
                    </span>
                    {player.CurrentAnswer && question && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: player.CurrentAnswer === question.Answer 
                          ? (darkMode ? '#4ade80' : '#198754') 
                          : (darkMode ? '#f87171' : '#dc3545')
                      }}>
                        {player.CurrentAnswer === question.Answer ? '✓ Correct' : '✗ Wrong'}
                      </span>
                    )}
                  </Typography>
                </Box>

                {/* Score Display */}
                <Box sx={{ 
                  background: darkMode ? '#1a1a1a' : '#f0f0f0',
                  borderRadius: '15px',
                  padding: '12px 20px',
                  boxShadow: darkMode 
                    ? 'inset 4px 4px 8px #0d0d0d, inset -4px -4px 8px #262626'
                    : 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff',
                  textAlign: 'center',
                  minWidth: '80px'
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: index === 0 ? '#ffd700' : 
                             index === 1 ? '#c0c0c0' : 
                             index === 2 ? '#cd7f32' : 
                             darkMode ? '#a1662f' : '#666',
                      lineHeight: 1
                    }}
                  >
                    {player.CurrentScore}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#888' : '#999',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.5px'
                    }}
                  >
                    PTS
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
      </Box>

      {/* Empty State */}
      {(!scoreSheet || Object.keys(scoreSheet).length === 0) && (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 4,
          p: 4,
          borderRadius: '20px',
          background: darkMode ? '#1a1a1a' : '#f0f0f0',
          boxShadow: darkMode 
            ? 'inset 8px 8px 16px #0d0d0d, inset -8px -8px 16px #262626'
            : 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff',
          width: '100%',
          maxWidth: '400px'
        }}>
          <Typography variant="h6" sx={{ 
            color: darkMode ? '#666' : '#999',
            fontWeight: 500 
          }}>
            Waiting for scores...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NeumorphicScoreboard;