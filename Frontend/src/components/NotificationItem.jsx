const iconMap = {
  budget_alert:       { bg: 'rgba(245,158,11,0.12)', icon: '🎯' },
  large_transaction:  { bg: 'rgba(79,70,229,0.10)',  icon: '💸' },
  BUDGET_ALERT:       { bg: 'rgba(245,158,11,0.12)', icon: '🎯' },
  TRANSACTION_CREATED:{ bg: 'rgba(79,70,229,0.10)',  icon: '💸' },
  RECURRING_EXECUTED: { bg: 'rgba(16,185,129,0.10)', icon: '🔁' },
  UPCOMING_RECURRING: { bg: 'rgba(139,92,246,0.10)', icon: '📅' },
};

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const { id, title, message, type, is_read, created_at } = notification;
  const { bg, icon } = iconMap[type] || { bg: 'rgba(156,163,175,0.15)', icon: '🔔' };

  return (
    <div
      onClick={() => { if (!is_read) onMarkRead(id); }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
        borderLeft: is_read ? '3px solid transparent' : '3px solid #4F46E5',
        background: is_read ? '#fff' : 'rgba(79,70,229,0.025)',
        cursor: 'default', transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,70,229,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = is_read ? '#fff' : 'rgba(79,70,229,0.025)'}
    >
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{title}</p>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.5, marginTop: 3 }}>{message}</p>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.75rem', color: '#9CA3AF', marginTop: 5 }}>
          {created_at ? new Date(created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        {!is_read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5', animation: 'pulse-glow 2s infinite', display: 'block' }} />}
        <button onClick={e => { e.stopPropagation(); onDelete(id); }}
          style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
          onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
          onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
          aria-label="Delete notification">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>
  );
}
