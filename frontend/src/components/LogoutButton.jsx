import { useEffect } from 'react';
import { LogOut } from 'lucide-react'; // Optional: if using Lucide or similar icon lib

export default function LogoutButton({ onLogout }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .neumorphic-logout {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        font-weight: 600;
        background: linear-gradient(145deg, #252525, #2f2f2f);
        color: #fff;
        border: none;
        border-radius: 999px;
        box-shadow: 4px 4px 10px #1a1a1a, -4px -4px 10px #3a3a3a;
        cursor: pointer;
        transition: all 0.25s ease-in-out;
        font-family: 'Segoe UI', sans-serif;
      }

      .neumorphic-logout:hover {
        box-shadow: 0 0 10px rgba(49, 140, 231, 0.5);
        background: linear-gradient(145deg, #2f2f2f, #383838);
      }

      .neumorphic-logout:active {
        box-shadow: inset 3px 3px 6px #1a1a1a, inset -3px -3px 6px #3d3d3d;
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <button className="neumorphic-logout" onClick={onLogout}>
      {/* Optional icon */}
      {/* <LogOut size={16} /> */}
      Logout
    </button>
  );
}
