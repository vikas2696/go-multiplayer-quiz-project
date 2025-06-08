import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material';
import {
  YouTube,
  Instagram,
  Facebook,
  Twitter,
  Explore,
  Quiz,
  Rocket,
  Public,
  School,
  PlayArrow
} from '@mui/icons-material';

const SurfaceQuizHomepage = () => {
  const [version, setVersion] = useState(0);

  const handleVersionChange = (event, newValue) => {
    setVersion(newValue);
  };

  // Version 1: Dark Subtle/Calm (matching the uploaded image)
  const DarkVersion = () => (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #4caf50 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #81c784 0%, transparent 50%)
          `
        }}
      />
      
      {/* Header */}
      <AppBar position="static" sx={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Public sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            The Surface Quiz
          </Typography>
          <IconButton color="inherit"><YouTube /></IconButton>
          <IconButton color="inherit"><Instagram /></IconButton>
          <IconButton color="inherit"><Facebook /></IconButton>
          <IconButton color="inherit"><Twitter /></IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 300,
            background: 'linear-gradient(45deg, #4caf50, #81c784)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Explore Quizzes
        </Typography>
        
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', mb: 6, opacity: 0.8, fontWeight: 300 }}
        >
          The Surface Quiz
        </Typography>

        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Explore Card */}
          <Card
            sx={{
              width: 350,
              height: 280,
              background: 'rgba(76, 175, 80, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(76, 175, 80, 0.3)',
                border: '1px solid rgba(76, 175, 80, 0.4)'
              }
            }}
          >
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4caf50, #81c784)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <Explore sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                Explore the Surface
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, textAlign: 'center', mb: 3 }}>
                Dive into a variety of quizzes across different subjects
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  '&:hover': {
                    borderColor: '#81c784',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                  }
                }}
              >
                Explore The Surface
              </Button>
            </CardContent>
          </Card>

          {/* Quiz Card */}
          <Card
            sx={{
              width: 350,
              height: 280,
              background: 'rgba(129, 199, 132, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(129, 199, 132, 0.2)',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(129, 199, 132, 0.3)',
                border: '1px solid rgba(129, 199, 132, 0.4)'
              }
            }}
          >
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #81c784, #a5d6a7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <Quiz sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                Start Quizzing
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, textAlign: 'center', mb: 3 }}>
                Jump straight into a quiz and test your knowledge
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #4caf50, #81c784)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388e3c, #66bb6a)'
                  }
                }}
              >
                Take a Quiz
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );

  // Version 2: Space Theme
  const SpaceVersion = () => (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0f1419 0%, #000000 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Stars background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          animation: 'twinkle 3s ease-in-out infinite alternate'
        }}
      />

      {/* Nebula effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(30, 144, 255, 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(15, 20, 25, 0.8)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar>
          <Rocket sx={{ mr: 2, color: '#00bcd4' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            The Surface Quiz
          </Typography>
          <IconButton color="inherit"><YouTube /></IconButton>
          <IconButton color="inherit"><Instagram /></IconButton>
          <IconButton color="inherit"><Facebook /></IconButton>
          <IconButton color="inherit"><Twitter /></IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 300,
            background: 'linear-gradient(45deg, #00bcd4, #e91e63)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(0, 188, 212, 0.5)'
          }}
        >
          Mission Control
        </Typography>
        
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', mb: 6, opacity: 0.8, fontWeight: 300 }}
        >
          The Surface Quiz
        </Typography>

        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Explore Card */}
          <Card
            sx={{
              width: 350,
              height: 280,
              background: 'rgba(0, 188, 212, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(0, 188, 212, 0.3)',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 188, 212, 0.1)',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 20px 60px rgba(0, 188, 212, 0.4)',
                border: '2px solid rgba(0, 188, 212, 0.6)',
                background: 'rgba(0, 188, 212, 0.1)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent, rgba(0, 188, 212, 0.1), transparent)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover::before': {
                opacity: 1
              }
            }}
          >
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #00bcd4, #0097a7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 0 30px rgba(0, 188, 212, 0.5)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Explore sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center', color: '#00bcd4' }}>
                Explore the Surface
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, textAlign: 'center', mb: 3 }}>
                Navigate through cosmic knowledge across the universe
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#00bcd4',
                  color: '#00bcd4',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#00acc1',
                    backgroundColor: 'rgba(0, 188, 212, 0.1)',
                    boxShadow: '0 0 20px rgba(0, 188, 212, 0.3)'
                  }
                }}
              >
                Launch Explorer
              </Button>
            </CardContent>
          </Card>

          {/* Quiz Card */}
          <Card
            sx={{
              width: 350,
              height: 280,
              background: 'rgba(233, 30, 99, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(233, 30, 99, 0.3)',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(233, 30, 99, 0.1)',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 20px 60px rgba(233, 30, 99, 0.4)',
                border: '2px solid rgba(233, 30, 99, 0.6)',
                background: 'rgba(233, 30, 99, 0.1)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent, rgba(233, 30, 99, 0.1), transparent)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover::before': {
                opacity: 1
              }
            }}
          >
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #e91e63, #c2185b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 0 30px rgba(233, 30, 99, 0.5)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Quiz sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center', color: '#e91e63' }}>
                Start Quizzing
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, textAlign: 'center', mb: 3 }}>
                Engage hyperdrive and test your stellar knowledge
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #e91e63, #c2185b)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #d81b60, #ad1457)',
                    boxShadow: '0 0 20px rgba(233, 30, 99, 0.5)'
                  }
                }}
              >
                Initiate Quiz
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes twinkle {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
      `}</style>
    </Box>
  );

  // Version 3: 2D Animated Cartoon Earth/Surface Theme
  const CartoonVersion = () => (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 50%, #90EE90 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated clouds */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: '120px',
          height: '60px',
          background: 'white',
          borderRadius: '50px',
          opacity: 0.8,
          animation: 'float 6s ease-in-out infinite',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-20px',
            left: '20px',
            width: '60px',
            height: '60px',
            background: 'white',
            borderRadius: '50%'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-20px',
            right: '20px',
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '50%'
          }
        }}
      />

      {/* Mountains */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(180deg, #8FBC8F 0%, #556B2F 100%)',
          clipPath: 'polygon(0 100%, 0 60%, 15% 40%, 25% 60%, 40% 30%, 55% 50%, 70% 20%, 85% 45%, 100% 35%, 100% 100%)'
        }}
      />

      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)',
          color: '#2E7D32',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Public sx={{ mr: 2, color: '#4CAF50' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#2E7D32' }}>
            The Surface Quiz
          </Typography>
          <IconButton sx={{ color: '#2E7D32' }}><YouTube /></IconButton>
          <IconButton sx={{ color: '#2E7D32' }}><Instagram /></IconButton>
          <IconButton sx={{ color: '#2E7D32' }}><Facebook /></IconButton>
          <IconButton sx={{ color: '#2E7D32' }}><Twitter /></IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Floating Earth */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #4CAF50 30%, #2196F3 70%)',
            animation: 'rotate 20s linear infinite, bounce 3s ease-in-out infinite',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '40%',
              height: '30%',
              background: '#4CAF50',
              borderRadius: '50% 20% 50% 40%',
              transform: 'rotate(45deg)'
            }
          }}
        />

        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 800,
            color: '#2E7D32',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          🌍 Explore Our Planet! 🌍
        </Typography>
        
        <Typography
          variant="h4"
          sx={{ 
            textAlign: 'center', 
            mb: 6, 
            color: '#388E3C', 
            fontWeight: 600,
            fontSize: { xs: '1.8rem', md: '2.125rem' }
          }}
        >
          The Surface Quiz Adventure
        </Typography>

        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Explore Card */}
          <Card
            sx={{
              width: 350,
              height: 300,
              background: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC02 100%)',
              border: '4px solid #FF9800',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
              '&:hover': {
                transform: 'translateY(-10px) rotate(2deg)',
                boxShadow: '0 15px 40px rgba(255, 152, 0, 0.4)',
                border: '4px solid #F57C00'
              }
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: '#4CAF50',
                borderRadius: '50%',
                opacity: 0.3
              }}
            />
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: '4px solid white',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              >
                <School sx={{ fontSize: 45, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#2E7D32' }}>
                🏔️ Explore the Surface
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', mb: 3, color: '#388E3C', fontWeight: 500 }}>
                Discover amazing facts about our planet's surface!
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  border: '3px solid white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C, #689F38)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                🚀 Start Exploring!
              </Button>
            </CardContent>
          </Card>

          {/* Quiz Card */}
          <Card
            sx={{
              width: 350,
              height: 300,
              background: 'linear-gradient(135deg, #E1F5FE 0%, #03A9F4 100%)',
              border: '4px solid #2196F3',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                transform: 'translateY(-10px) rotate(-2deg)',
                boxShadow: '0 15px 40px rgba(33, 150, 243, 0.4)',
                border: '4px solid #1976D2'
              }
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                width: '80px',
                height: '80px',
                background: '#FF9800',
                borderRadius: '50%',
                opacity: 0.3
              }}
            />
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: '4px solid white',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  animation: 'wiggle 1s ease-in-out infinite'
                }}
              >
                <PlayArrow sx={{ fontSize: 45, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#1565C0' }}>
                🎯 Start Quizzing
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', mb: 3, color: '#1976D2', fontWeight: 500 }}>
                Test your knowledge with fun surface quizzes!
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  border: '3px solid white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2, #42A5F5)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                🎮 Take Quiz Now!
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
      `}</style>
    </Box>
  );

  return (
    <Box>
      {/* Version Selector */}
      <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <Tabs
          value={version}
          onChange={handleVersionChange}
          sx={{
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            '& .MuiTab-root': {
              color: 'white',
              minWidth: 80,
              fontSize: '0.8rem'
            },
            '& .Mui-selected': {
              color: '#4CAF50 !important'
            }
          }}
        >
          <Tab label="Dark" />
          <Tab label="Space" />
          <Tab label="Cartoon" />
        </Tabs>
      </Box>

      {/* Render selected version */}
      {version === 0 && <DarkVersion />}
      {version === 1 && <SpaceVersion />}
      {version === 2 && <CartoonVersion />}
    </Box>
  );
};

export default SurfaceQuizHomepage;