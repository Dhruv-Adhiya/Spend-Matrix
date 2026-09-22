import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed lucide-react
import { IconButton } from '../ui/IconButton';
import { notificationService } from '../../services/notificationService';
import toast from 'react-hot-toast';
import './NotificationBell.css';

export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchUnread = async () => {
    try {
      const res = await notificationService.getNotifications(1, 5, true);
      // Assuming response shape is { data: { data: [...], pagination: { total } } } or similar
      const data = res.data?.data || res.data || [];
      setNotifications(data.slice(0, 5));
      setUnreadCount(res.data?.pagination?.total || data.length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchUnread();
    
    // Polling could be added here, but for now we'll just fetch on mount
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchUnread(); // Refresh on open
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <div className="notification-bell-trigger">
        <IconButton 
          icon="Bell" 
          onClick={toggleDropdown} 
          aria-label={`Notifications (${unreadCount} unread)`}
          variant="ghost"
          className="bell-btn"
        />
        {unreadCount > 0 && (
          <span className="unread-dot" title={`${unreadCount} unread`}></span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} New</span>
            )}
          </div>
          
          <div className="notification-dropdown-body">
            {notifications.length === 0 ? (
              <div className="notification-empty-text">No new notifications</div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="dropdown-notification-item unread">
                  <div className="notif-content">
                    <span className="notif-title">{notif.title}</span>
                    <span className="notif-msg">{notif.message}</span>
                  </div>
                  <button 
                    className="notif-mark-read" 
                    onClick={(e) => handleMarkAsRead(e, notif.id)}
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="notification-dropdown-footer" onClick={handleViewAll}>
            View all notifications
          </div>
        </div>
      )}
    </div>
  );
}
