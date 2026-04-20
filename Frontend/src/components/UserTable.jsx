import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/adminService';

const pgBtn = (active) => ({
  width: 36, height: 36, borderRadius: 8, border: active ? 'none' : '1.5px solid #E5E7EB',
  background: active ? '#7C3AED' : '#fff', color: active ? '#fff' : '#374151',
  fontFamily: '"DM Sans",sans-serif', fontWeight: active ? 600 : 400, fontSize: '0.875rem',
  cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export default function UserTable() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [blockedFilter, setBlockedFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true); setError('');
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (blockedFilter !== '') params.is_blocked = blockedFilter;
      const res = await adminAPI.getUsers(params);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally { setLoading(false); }
  }, [search, roleFilter, blockedFilter]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const handleBlock = async (id, currentBlocked) => {
    setActionError('');
    try { await adminAPI.blockUser(id, !currentBlocked); fetchUsers(pagination.page); }
    catch (err) { setActionError(err.response?.data?.error || 'Action failed'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will also remove their transactions.`)) return;
    setActionError('');
    try { await adminAPI.deleteUser(id); fetchUsers(pagination.page); }
    catch (err) { setActionError(err.response?.data?.error || 'Delete failed'); }
  };

  const cols = ['ID', 'NAME', 'EMAIL', 'ROLE', 'STATUS', 'JOINED', 'ACTIONS'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} className="input" style={{ width: 240 }} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input" style={{ width: 140 }}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select value={blockedFilter} onChange={e => setBlockedFilter(e.target.value)} className="input" style={{ width: 140 }}>
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Blocked</option>
        </select>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{error}</div>}
      {actionError && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{actionError}</div>}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px 90px 110px 120px', alignItems: 'center', padding: '10px 20px', background: 'rgba(139,92,246,0.04)', borderBottom: '1.5px solid rgba(139,92,246,0.08)' }}>
          {cols.map(c => <span key={c} style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c}</span>)}
        </div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}><span className="spinner" /></div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', fontFamily: '"DM Sans",sans-serif', color: '#9CA3AF' }}>No users found</div>
        ) : data.map((u, i) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px 90px 110px 120px', alignItems: 'center', padding: '12px 20px', borderBottom: i < data.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#9CA3AF' }}>{u.id}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{u.full_name}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280' }}>{u.email}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', borderRadius: 999, padding: '3px 10px', border: '1px solid', ...(u.role === 'admin' ? { background: '#F5F3FF', color: '#5B21B6', borderColor: '#DDD6FE' } : { background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE' }) }}>{u.role}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', borderRadius: 999, padding: '3px 10px', border: '1px solid', ...(u.is_blocked ? { background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA' } : { background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }) }}>{u.is_blocked ? 'Blocked' : 'Active'}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{new Date(u.created_at).toLocaleDateString()}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {u.role !== 'admin' && (
                <>
                  <button onClick={() => handleBlock(u.id, u.is_blocked)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', transition: 'all 0.15s', ...(u.is_blocked ? { background: '#ECFDF5', color: '#065F46' } : { background: '#FFFBEB', color: '#92400E' }) }}>
                    {u.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button onClick={() => handleDelete(u.id, u.full_name)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', background: '#FEF2F2', color: '#991B1B', transition: 'all 0.15s' }}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{pagination.total} total users</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button disabled={pagination.page <= 1} onClick={() => fetchUsers(pagination.page - 1)} style={{ ...pgBtn(false), opacity: pagination.page <= 1 ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ ...pgBtn(false), cursor: 'default', minWidth: 80, fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>Page {pagination.page} / {pagination.totalPages}</span>
          <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchUsers(pagination.page + 1)} style={{ ...pgBtn(false), opacity: pagination.page >= pagination.totalPages ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
