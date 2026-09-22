import { useState, useEffect, useCallback } from 'react';
// Removed lucide-react
import toast from 'react-hot-toast';
import { notificationService } from '../../services/notificationService';
import { NotificationList } from '../../components/notifications/NotificationList';
import { GlassButton } from '../../components/ui/GlassButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import './NotificationsPage.css';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchNotifications = useCallback(async (pageNum) => {
    try {
      setIsLoading(true);
      // We pass is_read=undefined or don't pass it to get ALL notifications on this page, 
      // or we can just fetch all depending on backend support. 
      // The API contract says `GET /notifications?page=1&limit=20&is_read=false`. 
      // We'll just fetch without `is_read` to show both read and unread, if backend allows.
      // If backend requires is_read, we'll fetch unread. For a full page, it's best to show all.
      // Let's omit `is_read` to fetch all history.
      const res = await notificationService.getNotifications(pageNum, limit);
      const data = res.data?.data || res.data || [];
      const pagination = res.data?.pagination || { totalPages: 1 };
      
      setNotifications(data);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(page);
  }, [fetchNotifications, page]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Stay updated on your budget alerts and automated transactions.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <GlassButton variant="secondary" icon="CheckCheck" onClick={handleMarkAllRead}>
            Mark All as Read
          </GlassButton>
        )}
      </div>

      <div className="notifications-content">
        {isLoading ? (
          <div className="notifications-center-state">
            <Spinner size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="notifications-center-state">
            <EmptyState
              title="You're all caught up."
              description="No new notifications to show right now."
              icon="bell"
            />
          </div>
        ) : (
          <>
            <NotificationList 
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
            
            {totalPages > 1 && (
              <div className="pagination-controls">
                <GlassButton 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                  variant="secondary"
                >
                  Previous
                </GlassButton>
                <span className="page-info">Page {page} of {totalPages}</span>
                <GlassButton 
                  onClick={handleNextPage} 
                  disabled={page === totalPages}
                  variant="secondary"
                >
                  Next
                </GlassButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
