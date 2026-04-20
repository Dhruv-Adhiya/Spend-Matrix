import { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import NotificationList from '../components/NotificationList';
import { notificationAPI } from '../services/notificationService';

const PAGE_SIZE = 20;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [markingAll, setMarkingAll] = useState(false);
  const pendingRef = useRef(new Set());
  const deletingRef = useRef(new Set());

  const fetchNotifications = useCallback(async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await notificationAPI.getAll({ page: p, limit: PAGE_SIZE });
      setNotifications(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  const handleMarkRead = async (id) => {
    if (pendingRef.current.has(id)) return; // prevent duplicate calls
    pendingRef.current.add(id);

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      await notificationAPI.markAsRead(id);
    } catch {
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
      setError('Failed to mark notification as read.');
    } finally {
      pendingRef.current.delete(id);
    }
  };

  const handleDelete = async (id) => {
    if (deletingRef.current.has(id)) return;
    deletingRef.current.add(id);

    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));

    try {
      await notificationAPI.remove(id);
    } catch {
      // Revert on failure — refetch current page
      await fetchNotifications(page);
      setError('Failed to delete notification.');
    } finally {
      deletingRef.current.delete(id);
    }
  };

  const handleMarkAllRead = async () => {
    if (markingAll) return;
    setMarkingAll(true);

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      await notificationAPI.markAllAsRead();
    } catch {
      // Revert on failure
      await fetchNotifications(page);
      setError('Failed to mark all notifications as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <MainLayout>
      <div className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} disabled={markingAll} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
            {markingAll ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Marking...</> : 'Mark All as Read'}
          </button>
        )}
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}><span>{error}</span><button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>✕</button></div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ height: 80, borderRadius: 12, background: 'linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />)}
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, gap: 14 }}>
          <span style={{ fontSize: 64, color: '#D1D5DB' }}>🔔</span>
          <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#9CA3AF' }}>You're all caught up!</p>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>No notifications at the moment.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
          {notifications.map((n, i) => {
            const iconMap = { budget_alert: { bg: 'rgba(245,158,11,0.12)', icon: '🎯' }, large_transaction: { bg: 'rgba(79,70,229,0.10)', icon: '💸' } };
            const { bg, icon } = iconMap[n.type] || { bg: 'rgba(156,163,175,0.15)', icon: '🔔' };
            return (
              <div key={n.id}
                className={`notif-page-item ${n.is_read ? 'notif-page-item-read' : 'notif-page-item-unread'}`}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderBottom: i < notifications.length-1 ? '1px solid #F3F4F6' : 'none', position: 'relative', cursor: 'default', transition: 'all 0.15s ease', borderLeft: n.is_read ? '3px solid transparent' : '3px solid #4F46E5', background: n.is_read ? 'var(--color-surface)' : 'rgba(79,70,229,0.025)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.02)'; e.currentTarget.querySelector('.notif-actions').style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = n.is_read ? 'var(--color-surface)' : 'rgba(79,70,229,0.025)'; e.currentTarget.querySelector('.notif-actions').style.opacity = '0'; }}
              >
                {/* Icon */}
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="notif-page-title" style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{n.title}</p>
                  <p className="notif-page-message" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.5, marginTop: 3 }}>{n.message}</p>
                  <p className="notif-page-time" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.75rem', color: '#9CA3AF', marginTop: 5 }}>{n.created_at ? new Date(n.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}</p>
                </div>
                {/* Right */}
                <div className="notif-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, opacity: 0, transition: 'opacity 0.15s' }}>
                  {!n.is_read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5', animation: 'pulse-glow 2s infinite', display: 'block' }} />}
                  {!n.is_read && (
                    <button onClick={() => handleMarkRead(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.75rem', color: '#4F46E5' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Mark as read</button>
                  )}
                  <button onClick={() => handleDelete(n.id)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, padding: '0 20px 20px' }}>
          <button onClick={() => setPage(p => p-1)} disabled={page===1}
            style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: page===1 ? 'not-allowed' : 'pointer', opacity: page===1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280', padding: '0 8px' }}>Page {page} of {pagination.totalPages}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page===pagination.totalPages}
            style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: page===pagination.totalPages ? 'not-allowed' : 'pointer', opacity: page===pagination.totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
      </div>
    </MainLayout>
  );
}
