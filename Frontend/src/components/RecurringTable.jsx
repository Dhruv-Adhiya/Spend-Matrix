import ToggleSwitch from './ToggleSwitch';

const freqBadge = {
  daily:   { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  weekly:  { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  monthly: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
  yearly:  { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' },
};

const SOURCE_LABEL = { online: 'Online', cash: 'Cash', credit_card: 'Credit Card' };

export default function RecurringTable({ rules, toggling, onEdit, onDelete, onToggle }) {
  if (!rules.length) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
        <span style={{ fontSize: 48 }}>🔁</span>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: '#9CA3AF' }}>No recurring rules yet.</p>
      </div>
    );
  }

  const cols = ['CATEGORY', 'TYPE', 'AMOUNT', 'FREQUENCY', 'NEXT RUN', 'SOURCE', 'STATUS', 'ACTIONS'];

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 100px 110px 110px 100px 90px', alignItems: 'center', padding: '10px 20px', background: 'rgba(79,70,229,0.04)', borderBottom: '1.5px solid rgba(79,70,229,0.08)' }}>
        {cols.map(c => <span key={c} style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c}</span>)}
      </div>
      {rules.map((r, i) => {
        const freq = freqBadge[r.frequency] || { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
        return (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 100px 110px 110px 100px 90px', alignItems: 'center', padding: '12px 20px', borderBottom: i < rules.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.15s', opacity: r.is_active ? 1 : 0.6 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,70,229,0.025)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#374151' }}>{r.category_name ?? `#${r.category_id}`}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', borderRadius: 999, padding: '3px 10px', border: '1px solid', ...(r.type === 'income' ? { background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' } : { background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA' }) }}>{r.type}</span>
            <span style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 600, fontSize: '0.9375rem', color: r.type === 'income' ? '#059669' : '#DC2626' }}>
              {r.type === 'income' ? '+' : '-'}₹{Number(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', borderRadius: 999, padding: '3px 10px', border: '1px solid', background: freq.bg, color: freq.color, borderColor: freq.border }}>{r.frequency}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{r.next_run_date ? new Date(r.next_run_date).toLocaleDateString('en-IN') : '—'}</span>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>{SOURCE_LABEL[r.payment_source] ?? r.payment_source}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ToggleSwitch checked={r.is_active} onChange={() => onToggle(r)} disabled={toggling === r.id} />
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.75rem', color: r.is_active ? '#059669' : '#9CA3AF' }}>{toggling === r.id ? '…' : r.is_active ? 'Active' : 'Paused'}</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => onEdit(r)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
                onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'} onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => onDelete(r)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EF4444'} onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
