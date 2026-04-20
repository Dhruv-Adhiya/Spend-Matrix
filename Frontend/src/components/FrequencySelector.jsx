const FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];

export default function FrequencySelector({ value, onChange }) {
  return (
    <div className="pill-toggle" style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 4, gap: 4 }}>
      {FREQUENCIES.map(f => (
        <button key={f} type="button" onClick={() => onChange(f)}
          style={{
            flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.8125rem',
            textTransform: 'capitalize', transition: 'all 0.2s',
            ...(value === f
              ? { background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }
              : { background: 'transparent', color: '#9CA3AF' }),
          }}
        >{f}</button>
      ))}
    </div>
  );
}
