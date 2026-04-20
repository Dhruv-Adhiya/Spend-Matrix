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

  const actionBadge = {
    USER_BLOCKED:   { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
    USER_UNBLOCKED: { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
    USER_DELETED:   { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
  };

  const pgBtn = (active) => ({
    width: 36, height: 36, borderRadius: 8, border: active ? 'none' : '1.5px solid #E5E7EB',
    background: active ? '#7C3AED' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: '"DM Sans",sans-serif', fontWeight: active ? 600 : 400, fontSize: '0.875rem',
    cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Filter by user ID..."
          value={filters.user_id} onChange={e => set('user_id', e.target.value)}
          className="input" style={{ width: 180 }}
        />
        <select value={filters.action} onChange={e => set('action', e.target.value)} className="input" style={{ width: 180 }}>
          <option value="">All Actions</option>
          <option value="USER_BLOCKED">USER_BLOCKED</option>
          <option value="USER_UNBLOCKED">USER_UNBLOCKED</option>
          <option value="USER_DELETED">USER_DELETED</option>
        </select>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 1fr 110px 140px', alignItems: 'center', padding: '10px 20px', background: 'rgba(139,92,246,0.04)', borderBottom: '1.5px solid rgba(139,92,246,0.08)' }}>
          {['ADMIN','ACTION','ENTITY','METADATA','IP','TIME'].map(c => (
            <span key={c} style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c}</span>
          ))}
        </div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120, gap: 10 }}>
            <span className="spinner" />
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', fontFamily: '"DM Sans",sans-serif', color: '#9CA3AF' }}>No logs found</div>
        ) : logs.map((l, i) => {
          const badge = actionBadge[l.action] || { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
          return (
            <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 1fr 110px 140px', alignItems: 'center', padding: '12px 20px', borderBottom: i < logs.length-1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280' }}>{l.email ?? l.user_id}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', borderRadius: 999, padding: '3px 10px', border: '1px solid', background: badge.bg, color: badge.color, borderColor: badge.border }}>{l.action}</span>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>{l.entity_type ?? '—'}</span>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.75rem', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.metadata ? JSON.stringify(l.metadata) : '—'}</span>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#9CA3AF' }}>{l.ip_address ?? '—'}</span>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{new Date(l.created_at).toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{meta.total} total logs</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} style={{ ...pgBtn(false), opacity: filters.page <= 1 ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ ...pgBtn(false), cursor: 'default', minWidth: 80, fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>Page {meta.page} / {meta.totalPages || 1}</span>
          <button disabled={filters.page >= meta.totalPages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} style={{ ...pgBtn(false), opacity: filters.page >= meta.totalPages ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
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

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 192 }}><span className="spinner" /></div>;
  if (error) return <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{error}</div>;

  const net = (stats.total_income || 0) - (stats.total_expense || 0);
  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Number(n) || 0);

  return (
    <div className="grid-admin-stats">
      <StatsCard label="Total Users" value={stats.total_users} icon="👥" />
      <StatsCard label="Active Users" value={stats.active_users} icon="✅" />
      <StatsCard label="Total Transactions" value={stats.total_transactions} icon="💳" />
      <StatsCard label="Total Income" value={fmt(stats.total_income)} icon="📥" />
      <StatsCard label="Total Expense" value={fmt(stats.total_expense)} icon="📤" />
      <StatsCard label="Net Balance" value={fmt(net)} icon={net >= 0 ? '📈' : '📉'} />
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
