import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout('/login');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">🎬 Movies.KZ</div>
      <nav>
        {!token ? (
          <Link to="/login" className="auth-icon">
            <FaUserCircle size={22} /> Login
          </Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt size={20} /> Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
