import PropTypes from 'prop-types';
import { Icon } from '../ui/Icon';
import { GlassCard } from '../ui/GlassCard';
import { IconButton } from '../ui/IconButton';
import './NotificationList.css';

export const NotificationList = ({ notifications, onMarkRead, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'budget_alert':
      case 'warning':
        return <Icon name="AlertTriangle" size={20} className="text-warning" />;
      case 'recurring_trigger':
      case 'info':
        return <Icon name="AlertCircle" size={20} className="text-info" />;
      case 'expense':
        return <Icon name="DollarSign" size={20} className="text-expense" />;
      case 'income':
        return <Icon name="DollarSign" size={20} className="text-income" />;
      default:
        return <Icon name="Bell" size={20} className="text-primary" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    // Format to "Oct 15, 2023 at 10:30 AM"
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="notification-list-container">
      {notifications.map((notif) => (
        <GlassCard 
          key={notif.id} 
          className={`notification-list-item ${notif.is_read ? 'read' : 'unread'}`}
          padding="small"
        >
          <div className="notif-icon-wrapper">
            {getIcon(notif.type)}
          </div>
          
          <div className="notif-body">
            <div className="notif-header">
              <h4 className="notif-list-title">{notif.title}</h4>
              <span className="notif-time">{formatDate(notif.created_at)}</span>
            </div>
            <p className="notif-list-msg">{notif.message}</p>
          </div>
          
          <div className="notif-actions">
            {!notif.is_read && (
              <IconButton 
                icon="Check" 
                onClick={() => onMarkRead(notif.id)} 
                aria-label="Mark as read"
                size="small"
                variant="ghost"
                className="mark-read-btn"
              />
            )}
            <IconButton 
              icon="Trash2" 
              onClick={() => onDelete(notif.id)} 
              aria-label="Delete notification"
              size="small"
              variant="ghost"
              className="delete-notif-btn"
            />
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired,
  onMarkRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
