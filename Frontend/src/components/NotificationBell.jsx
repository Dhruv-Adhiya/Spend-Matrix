import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/notificationService';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const fetchUnread = async () => {
    try {
      const res = await notificationAPI.getAll({ is_read: false, limit: 50 });
      setUnreadCount(res.data.pagination?.total ?? 0);
    } catch {
      // silent — bell should never break the layout
    }
  };

  useEffect(() => {
    fetchUnread();
    intervalRef.current = setInterval(fetchUnread, 60_000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
      aria-label="Notifications"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
