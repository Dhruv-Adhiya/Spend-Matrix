import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/adminService';
import AdminSidebar from '../components/AdminSidebar';
import StatsCard from '../components/StatsCard';
import UserTable from '../components/UserTable';
import TransactionTable from '../components/TransactionTable';
import AdminRecurringTable from '../components/AdminRecurringTable';
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
      case 'recurring': return <AdminRecurringTable />;
      case 'logs': return <AuditLogs />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF8FF' }}>
      {/* Admin Header */}
      <header style={{ height: 64, background: 'rgba(245,243,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1.5px solid rgba(196,181,253,0.4)', boxShadow: '0 2px 20px rgba(139,92,246,0.06)', position: 'sticky', top: 0, zIndex: 50, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 20 }}>💰</span>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#9CA3AF' }}>SpendMatrix</span>
          <span style={{ fontFamily: '"DM Sans",sans-serif', color: '#D1D5DB' }}>/</span>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#7C3AED' }}>🛡️ Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <NotificationBell />
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 14, color: '#fff' }}>
            {user?.full_name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)}
          </div>
          <button onClick={() => navigate('/dashboard')}
            style={{ height: 32, padding: '0 12px', background: 'rgba(124,58,237,0.1)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.color = '#7C3AED'; }}
          >Exit Admin</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <AdminSidebar active={tab} onChange={setTab} />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="page-enter">
            <h1 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#7C3AED', marginBottom: 20 }}>{tabTitles[tab]}</h1>
            {renderTab()}
          </div>
        </main>
      </div>
    </div>
  );
}
