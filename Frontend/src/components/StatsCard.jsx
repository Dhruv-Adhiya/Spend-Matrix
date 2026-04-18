import { useState, useEffect } from 'react';

function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target == null) return;
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (!numeric) { setCount(target); return; }
    let start = 0;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function StatsCard({ label, value, icon, change }) {
  const animated = useCountUp(value);
  const isPositive = change > 0;
  const isNeutral  = change === 0 || change == null;

  return (
    <div className="card card-hover" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circle */}
      <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(139,92,246,0.06)', pointerEvents: 'none' }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
          {icon}
        </div>
        {!isNeutral && (
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: isPositive ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: 2 }}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>

      {/* Value */}
      <p style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 700, fontSize: '1.625rem', color: '#111827', marginTop: 14, animation: 'countUp 0.5s ease both' }}>
        {animated}
      </p>

      {/* Label */}
      <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: '#6B7280', marginTop: 4 }}>{label}</p>
      <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: '0.75rem', color: '#9CA3AF' }}>vs last month</p>
    </div>
  );
}
