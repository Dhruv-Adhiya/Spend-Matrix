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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
            {pagination.total > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">{pagination.total} total</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 transition"
            >
              {markingAll ? 'Marking…' : 'Mark all as read'}
            </button>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-3 text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <NotificationList notifications={notifications} onMarkRead={handleMarkRead} onDelete={handleDelete} />
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pagination.totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
