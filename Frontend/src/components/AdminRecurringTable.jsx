import { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminService';

const freqBadge = {
  daily:   { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  weekly:  { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  monthly: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
  yearly:  { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' },
};

const pgBtn = (active) => ({
  width: 36, height: 36, borderRadius: 8, border: active ? 'none' : '1.5px solid #E5E7EB',
  background: active ? '#7C3AED' : '#fff', color: active ? '#fff' : '#374151',
  fontFamily: '"DM Sans",sans-serif', fontWeight: active ? 600 : 400, fontSize: '0.875rem',
  cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export default function AdminRecurringTable() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(null);
  const [toggleError, setToggleError] = useState('');

  const fetchData = async (p = 1) => {
    setLoading(true); setError('');
    try {
      const res = await adminAPI.getRecurring({ page: p, limit: 20 });
      setData(res.data?.data ?? []);
      const pg = res.data?.pagination ?? {};
      setMeta({ total: pg.total ?? 0, page: pg.page ?? 1, totalPages: pg.totalPages ?? 1 });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load recurring rules.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const handleToggle = async (rule) => {
    if (toggling === rule.id) return;
    setToggling(rule.id); setToggleError('');
    try {
      await adminAPI.toggleRecurring(rule.id);
      setData(prev => prev.map(r => r.id === rule.id ? { ...r, is_active: !r.is_active } : r));
    } catch (err) {
      setToggleError(err.response?.data?.message || err.response?.data?.error || 'Toggle failed.');
    } finally { setToggling(null); }
  };

  const fmtAmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(n));
  const cols = ['ID', 'USER', 'CATEGORY', 'TYPE', 'AMOUNT', 'FREQUENCY', 'NEXT RUN', 'STATUS', 'ACTION'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{error}</div>}
      {toggleError && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{toggleError}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 110px 90px 110px 100px 110px 90px 90px', alignItems: 'center', padding: '10px 20px', background: 'rgba(139,92,246,0.04)', borderBottom: '1.5px solid rgba(139,92,246,0.08)' }}>
          {cols.map(c => <span key={c} style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c}</span>)}
        </div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}><span className="spinner" /></div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', fontFamily: '"DM Sans",sans-serif', color: '#9CA3AF' }}>No recurring rules found.</div>
        ) : data.map((r, i) => {
          const freq = freqBadge[r.frequency] || { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
          return (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 110px 90px 110px 100px 110px 90px 90px', alignItems: 'center', padding: '12px 20px', borderBottom: i < data.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.15s', opacity: r.is_active ? 1 : 0.6 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#9CA3AF' }}>{r.id}</span>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.user_email ?? r.user_id}</span>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#374151' }}>{r.category_name ?? `#${r.category_id}`}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.7rem', borderRadius: 999, padding: '2px 6px', border: '1px solid', ...(r.type === 'income' ? { background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' } : { background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA' }) }}>{r.type}</span>
              <span style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 600, fontSize: '0.9375rem', color: r.type === 'income' ? '#059669' : '#DC2626' }}>
                {r.type === 'income' ? '+' : '-'}{fmtAmt(r.amount)}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.7rem', borderRadius: 999, padding: '2px 6px', border: '1px solid', background: freq.bg, color: freq.color, borderColor: freq.border }}>{r.frequency}</span>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>
                {r.next_run_date ? new Date(r.next_run_date).toLocaleDateString('en-IN') : '—'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.7rem', borderRadius: 999, padding: '2px 6px', border: '1px solid', ...(r.is_active ? { background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' } : { background: '#F3F4F6', color: '#6B7280', borderColor: '#E5E7EB' }) }}>
                {r.is_active ? 'Active' : 'Inactive'}
              </span>
              <button disabled={toggling === r.id} onClick={() => handleToggle(r)}
                style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: toggling === r.id ? 'wait' : 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', transition: 'all 0.15s', opacity: toggling === r.id ? 0.5 : 1, ...(r.is_active ? { background: '#FEF2F2', color: '#991B1B' } : { background: '#ECFDF5', color: '#065F46' }) }}>
                {toggling === r.id ? '…' : r.is_active ? 'Disable' : 'Enable'}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{meta.total} total rules</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ ...pgBtn(false), opacity: page <= 1 ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ ...pgBtn(false), cursor: 'default', minWidth: 80, fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>Page {meta.page} / {meta.totalPages || 1}</span>
          <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} style={{ ...pgBtn(false), opacity: page >= meta.totalPages ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
