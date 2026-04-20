const TABS = ['Profile', 'Password', 'Preferences'];

export default function SettingsTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', padding: '0 24px', gap: 0 }}>
      {TABS.map(tab => (
        <button key={tab} onClick={() => onChange(tab)}
          style={{
            padding: '14px 20px', fontFamily: '"DM Sans",sans-serif',
            fontWeight: active === tab ? 600 : 500, fontSize: '0.9375rem',
            cursor: 'pointer', border: 'none', background: 'transparent',
            color: active === tab ? '#4F46E5' : '#6B7280',
            position: 'relative', transition: 'color 0.15s',
          }}
          onMouseEnter={e => { if (active !== tab) e.currentTarget.style.color = '#4F46E5'; }}
          onMouseLeave={e => { if (active !== tab) e.currentTarget.style.color = '#6B7280'; }}
        >
          {tab}
          {active === tab && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#4F46E5,#8B5CF6)', borderRadius: '3px 3px 0 0' }} />}
        </button>
      ))}
    </div>
  );
}
