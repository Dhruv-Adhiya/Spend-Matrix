import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { notificationAPI } from '../services/notificationService';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function notifIcon(type) {
  if (type === 'budget_alert') return { bg: 'rgba(245,158,11,0.12)', icon: '🎯' };
  if (type === 'large_transaction') return { bg: 'rgba(79,70,229,0.10)', icon: '💸' };
  return { bg: 'rgba(156,163,175,0.15)', icon: '🔔' };
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const res = await notificationAPI.getAll({ limit: 5 });
      const items = res.data.notifications || res.data.data || [];
      setNotifications(items);
      const unread = items.filter(n => !n.is_read).length;
      setUnreadCount(res.data.pagination?.total ?? unread);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchNotifs();
    intervalRef.current = setInterval(fetchNotifs, 60_000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead?.();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch { /* silent */ }
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Notifications"
        style={{
          width: 36, height: 36, borderRadius: '50%', border: 'none',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#6B7280', transition: 'all 0.18s ease', position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.08)'; e.currentTarget.style.color = '#4F46E5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 18, height: 18, borderRadius: '50%',
            background: '#EF4444', border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: 10, color: '#fff',
            padding: '0 3px',
            animation: 'pulse-glow 2s infinite',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 44, zIndex: 200,
          width: 340,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(229,231,235,0.8)', borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.06)',
          animation: 'slideInRight 0.2s ease both',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.8rem', color: '#4F46E5' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >Mark all read</button>
            )}
          </div>

          {/* Items */}
          {notifications.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, color: '#D1D5DB', marginBottom: 8 }}>🔔</div>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#9CA3AF' }}>No new notifications</p>
            </div>
          ) : (
            notifications.map(n => {
              const { bg, icon } = notifIcon(n.type);
              return (
                <div key={n.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 16px',
                  borderBottom: '1px solid #F3F4F6',
                  borderLeft: n.is_read ? '2px solid transparent' : '2px solid #4F46E5',
                  background: n.is_read ? '#fff' : 'rgba(79,70,229,0.025)',
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{n.title}</p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.4, marginTop: 2 }}>{n.message}</p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.75rem', color: '#9CA3AF', marginTop: 4 }}>{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              );
            })
          )}

          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
            <Link to="/notifications" onClick={() => setOpen(false)} style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem', color: '#4F46E5', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >View All Notifications →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
