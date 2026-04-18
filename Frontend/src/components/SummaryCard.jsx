import { useState, useEffect } from 'react';

function useCountUp(target, duration = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const config = {
  balance: {
    bar: 'linear-gradient(180deg, #4F46E5, #8B5CF6)',
    iconBg: 'linear-gradient(135deg, #EEF2FF, #DDD6FE)',
    icon: '💰',
    labelColor: '#4F46E5',
    valueColor: '#111827',
    sub: 'Current Month Net',
    decor: 'rgba(79,70,229,0.06)',
  },
  income: {
    bar: 'linear-gradient(180deg, #10B981, #34D399)',
    iconBg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    icon: '📥',
    labelColor: '#059669',
    valueColor: '#059669',
    sub: 'Money received',
    decor: 'rgba(16,185,129,0.06)',
  },
  expense: {
    bar: 'linear-gradient(180deg, #EF4444, #F87171)',
    iconBg: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
    icon: '📤',
    labelColor: '#DC2626',
    valueColor: '#DC2626',
    sub: 'Money spent',
    decor: 'rgba(239,68,68,0.06)',
  },
};

export default function SummaryCard({ title, amount, type }) {
  const c = config[type] || config.balance;
  const numericAmount = Number(amount ?? 0);
  const animated = useCountUp(numericAmount);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 2,
  }).format(animated);

  return (
    <div
      className="card card-hover"
      style={{ padding: '20px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        borderRadius: '4px 0 0 4px',
        background: c.bar,
      }} />

      {/* Decorative circle */}
      <div style={{
        position: 'absolute', bottom: -20, right: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: c.decor, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Icon circle */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: c.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>{c.icon}</div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: c.labelColor }}>
            {title}
          </p>
          <p style={{
            fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: '1.75rem',
            color: c.valueColor, lineHeight: 1.2,
            animation: 'countUp 0.5s ease both',
          }}>
            {formatted}
          </p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>
            {c.sub}
          </p>
        </div>
      </div>
    </div>
  );
}
