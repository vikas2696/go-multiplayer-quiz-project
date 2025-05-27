export const buttonStyles = (theme) => ({
    
    py: 1.1,
    borderRadius: '20px',
    fontSize: '0.85rem',
    textTransform: 'none',
    color: '#fff',
    background: '#000',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      background: '#1a1a1a',
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: '#66ccff',
      boxShadow: '0 0 6px 2px #66ccff',
    },
  });