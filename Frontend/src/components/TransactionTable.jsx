import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/adminService';

const pgBtn = (active) => ({
  width: 36, height: 36, borderRadius: 8, border: active ? 'none' : '1.5px solid #E5E7EB',
  background: active ? '#7C3AED' : '#fff', color: active ? '#fff' : '#374151',
  fontFamily: '"DM Sans",sans-serif', fontWeight: active ? 600 : 400, fontSize: '0.875rem',
  cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export default function TransactionTable() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', type: '', startDate: '', endDate: '', page: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = { limit: 15, page: filters.page };
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await adminAPI.getTransactions(params);
      setData(res.data?.data ?? []);
      const p = res.data?.pagination ?? {};
      setMeta({ total: p.total ?? 0, page: p.page ?? 1, totalPages: p.totalPages ?? 1 });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const fmtAmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(n));
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const cols = ['ID', 'USER', 'DESCRIPTION', 'TYPE', 'AMOUNT', 'CATEGORY', 'SOURCE', 'DATE'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search description..." value={filters.search} onChange={e => set('search', e.target.value)} className="input" style={{ width: 220 }} />
        <select value={filters.type} onChange={e => set('type', e.target.value)} className="input" style={{ width: 140 }}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="date" value={filters.startDate} onChange={e => set('startDate', e.target.value)} className="input" style={{ width: 150 }} />
        <input type="date" value={filters.endDate} onChange={e => set('endDate', e.target.value)} className="input" style={{ width: 150 }} />
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{error}</div>}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 90px 110px 110px 100px 110px', alignItems: 'center', padding: '10px 20px', background: 'rgba(139,92,246,0.04)', borderBottom: '1.5px solid rgba(139,92,246,0.08)' }}>
          {cols.map(c => <span key={c} style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c}</span>)}
        </div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}><span className="spinner" /></div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', fontFamily: '"DM Sans",sans-serif', color: '#9CA3AF' }}>No transactions found</div>
        ) : data.map((t, i) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 90px 110px 110px 100px 110px', alignItems: 'center', padding: '12px 20px', borderBottom: i < data.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#9CA3AF' }}>{t.id}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.user_email ?? t.user_id}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.9375rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || '—'}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.7rem', borderRadius: 999, padding: '2px 6px', border: '1px solid', ...(t.type === 'income' ? { background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' } : { background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA' }) }}>{t.type}</span>
            <span style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 600, fontSize: '0.9375rem', color: t.type === 'income' ? '#059669' : '#DC2626' }}>
              {t.type === 'income' ? '+' : '-'}{fmtAmt(t.amount)}
            </span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#374151' }}>{t.category_name ?? t.category_id}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280', textTransform: 'capitalize' }}>{t.payment_source ?? '—'}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{fmtDate(t.transaction_date ?? t.created_at)}</span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{meta.total} total transactions</span>
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
