import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/adminService';
import AdminSidebar from '../components/AdminSidebar';
import StatsCard from '../components/StatsCard';
import UserTable from '../components/UserTable';
import TransactionTable from '../components/TransactionTable';
import RecurringTable from '../components/RecurringTable';
import NotificationBell from '../components/NotificationBell';

// ── Audit Logs Tab ────────────────────────────────────────────────────────────
function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1 });
  const [filters, setFilters] = useState({ action: '', user_id: '', page: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 15 };
      if (filters.action) params.action = filters.action;
      if (filters.user_id) params.user_id = filters.user_id;
      const res = await adminAPI.getLogs(params);
      setLogs(res.data.logs ?? []);
      setMeta({ total: res.data.total, page: res.data.page, totalPages: Math.ceil(res.data.total / 15) });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(filters.page); }, [filters]);

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));

  const actionColors = {
    USER_BLOCKED: 'bg-yellow-100 text-yellow-700',
    USER_UNBLOCKED: 'bg-green-100 text-green-700',
    USER_DELETED: 'bg-red-100 text-red-600',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filter by user ID..."
          value={filters.user_id}
          onChange={(e) => set('user_id', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={filters.action}
          onChange={(e) => set('action', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Actions</option>
          <option value="USER_BLOCKED">USER_BLOCKED</option>
          <option value="USER_UNBLOCKED">USER_UNBLOCKED</option>
          <option value="USER_DELETED">USER_DELETED</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Entity</th>
              <th className="px-4 py-3 text-left">Metadata</th>
              <th className="px-4 py-3 text-left">IP</th>
              <th className="px-4 py-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No logs found</td></tr>
            ) : logs.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{l.email ?? l.user_id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[l.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {l.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{l.entity_type ?? '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">
                  {l.metadata ? JSON.stringify(l.metadata) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400">{l.ip_address ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{meta.total} total logs</span>
        <div className="flex gap-2">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >← Prev</button>
          <span className="px-3 py-1">Page {meta.page} / {meta.totalPages || 1}</span>
          <button
            disabled={filters.page >= meta.totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >Next →</button>
        </div>
      </div>
    </div>
  );
}

// ── Stats Tab ─────────────────────────────────────────────────────────────────
function SystemStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading stats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatsCard label="Total Users" value={stats.total_users} color="indigo" />
      <StatsCard label="Active Users" value={stats.active_users} color="green" />
      <StatsCard label="Total Transactions" value={stats.total_transactions} color="indigo" />
      <StatsCard label="Total Income" value={`$${stats.total_income?.toFixed(2)}`} color="green" />
      <StatsCard label="Total Expense" value={`$${stats.total_expense?.toFixed(2)}`} color="red" />
      <StatsCard
        label="Net Balance"
        value={`$${(stats.total_income - stats.total_expense).toFixed(2)}`}
        color={(stats.total_income - stats.total_expense) >= 0 ? 'green' : 'red'}
      />
    </div>
  );
}

// ── Tab title map ─────────────────────────────────────────────────────────────
const tabTitles = {
  stats: 'System Stats',
  users: 'User Management',
  transactions: 'All Transactions',
  recurring: 'Recurring Rules',
  logs: 'Audit Logs',
};

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');

  // Access control — redirect non-admins immediately
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => { logout(); navigate('/login'); };

  const renderTab = () => {
    switch (tab) {
      case 'stats': return <SystemStats />;
      case 'users': return <UserTable />;
      case 'transactions': return <TransactionTable />;
      case 'recurring': return <RecurringTable />;
      case 'logs': return <AuditLogs />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm h-14 flex items-center px-6 justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-indigo-600 font-bold text-lg">SpendMatrix</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.full_name}</span>
          <NotificationBell />
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
          >
            ← App
          </button>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <AdminSidebar active={tab} onChange={setTab} />
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-5">{tabTitles[tab]}</h1>
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
