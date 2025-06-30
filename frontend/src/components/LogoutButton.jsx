import { LogOut } from 'lucide-react';

export default function LogoutButton({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.6rem 1.2rem',
        fontSize: '0.7rem',
        fontWeight: 600,
        background: '#2b2b2b',
        color: '#ffffff',
        border: '1px solid #444',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'background 0.2s ease-in-out, transform 0.1s',
        fontFamily: 'Segoe UI, sans-serif',
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = '#3b3b3b')}
      onMouseOut={(e) => (e.currentTarget.style.background = '#2b2b2b')}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <LogOut size={15} />
      Logout
    </button>
  );
}
