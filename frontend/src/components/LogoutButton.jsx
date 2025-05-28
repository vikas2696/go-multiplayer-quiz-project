import { useEffect } from 'react';

export default function LogoutButton({ onLogout }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .neumorphic-logout {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.4rem 0.8rem;
        font-size: 0.75rem;
        background: #2c2c2c;
        color: #fff;
        border: none;
        border-radius: 12px;
        box-shadow: 4px 4px 8px #1a1a1a, -4px -4px 8px #3d3d3d;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

      .neumorphic-logout:hover {
        box-shadow: inset 2px 2px 4px #1a1a1a, inset -2px -2px 4px #3d3d3d;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <button className="neumorphic-logout" onClick={onLogout}>
      Logout
    </button>
  );
}
