import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { IconButton } from '../ui/IconButton';
import { useTheme } from '../../context/ThemeContext';
import { Icon } from '../ui/Icon';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export function Header({ onMenuClick }) {
  const location = useLocation();
  const { logout } = useAuth();
  const headerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    headerRef.current.style.setProperty('--mouse-x', `${x}px`);
    headerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  // Simple title mapping based on route
  const getPageTitle = (pathname) => {
    const path = pathname.split('/')[1] || 'dashboard';
    if (pathname.includes('/admin')) {
      const adminPath = pathname.split('/')[2];
      return `Admin / ${adminPath.charAt(0).toUpperCase() + adminPath.slice(1)}`;
    }
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header 
      className="main-header"
      ref={headerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Icon name="Menu" size={24} />
        </button>
        <h1 className="page-title">{getPageTitle(location.pathname)}</h1>
      </div>

      <div className="header-right">
        <NotificationBell />
        <IconButton 
          icon="LogOut" 
          aria-label="Log out" 
          onClick={logout} 
          title="Log out"
        />
      </div>
    </header>
  );
}

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};
