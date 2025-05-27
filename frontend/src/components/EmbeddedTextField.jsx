export const textFieldStyles = (darkMode) => ({
    width: '100%',
    background: darkMode ? '#0d0d0d' : '#e0e0e0',
    borderRadius: '20px',
    boxShadow: darkMode
      ? 'inset 3px 3px 8px #000, inset -3px -3px 8px #1a1a1a'
      : 'inset 3px 3px 8px #c0c0c0, inset -3px -3px 8px #ffffff',
    border: `1px solid ${darkMode ? '#222' : '#ccc'}`,
  });