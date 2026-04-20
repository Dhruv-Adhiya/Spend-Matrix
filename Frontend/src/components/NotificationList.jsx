import NotificationItem from './NotificationItem';

export default function NotificationList({ notifications, onMarkRead, onDelete }) {
  if (!notifications.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', gap: 10 }}>
        <span style={{ fontSize: 64, color: '#D1D5DB', lineHeight: 1 }}>🔔</span>
        <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#9CA3AF', marginTop: 8 }}>You're all caught up!</p>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#9CA3AF' }}>No notifications at the moment.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {notifications.map((n, i) => (
        <div key={n.id} style={{ borderBottom: i < notifications.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
          <NotificationItem notification={n} onMarkRead={onMarkRead} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
