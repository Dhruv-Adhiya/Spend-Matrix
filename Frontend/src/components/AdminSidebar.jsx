const tabs = [
  { key: 'stats',        label: '📊 Overview' },
  { key: 'users',        label: '👥 Users' },
  { key: 'transactions', label: '💳 Transactions' },
  { key: 'recurring',    label: '🔁 Recurring' },
  { key: 'logs',         label: '📋 Audit Logs' },
];

export default function AdminSidebar({ active, onChange }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
      borderRight: '1.5px solid rgba(196,181,253,0.35)',
      height: 'calc(100vh - 64px)', position: 'sticky', top: 64,
      padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4,
      boxShadow: '4px 0 20px rgba(139,92,246,0.05)', overflowY: 'auto',
    }}>
      <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>
        Admin Panel
      </p>

      {tabs.map(({ key, label }) => (
        <button key={key} onClick={() => onChange(key)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: active === key ? '10px 14px 10px 11px' : '10px 14px',
            borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
            fontFamily: '"DM Sans", sans-serif', fontWeight: active === key ? 600 : 500,
            fontSize: '0.875rem', transition: 'all 0.18s ease',
            borderLeft: active === key ? '3px solid #7C3AED' : '3px solid transparent',
            background: active === key ? 'rgba(139,92,246,0.12)' : 'transparent',
            color: active === key ? '#7C3AED' : '#9CA3AF',
          }}
          onMouseEnter={e => { if (active !== key) { e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.color = '#7C3AED'; } }}
          onMouseLeave={e => { if (active !== key) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; } }}
        >{label}</button>
      ))}

      {/* Bottom card */}
      <div style={{ marginTop: 'auto', marginTop: 'auto' }}>
        <div style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', borderRadius: 12, padding: 14 }}>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#fff' }}>🛡️ Admin Mode</p>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: '0.6875rem', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Manage users and monitor all transactions.</p>
        </div>
      </div>
    </aside>
  );
}
