import { Link } from 'react-router-dom';

const categoryColors = {
  food:          '#FEF3C7',
  travel:        '#DBEAFE',
  entertainment: '#F3E8FF',
  income:        '#D1FAE5',
  shopping:      '#FCE7F3',
  default:       '#EEF2FF',
};

function getCategoryColor(cat) {
  const key = (cat || '').toLowerCase();
  return categoryColors[key] || categoryColors.default;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(Number(amount));
}

export default function TransactionList({ transactions }) {
  if (!transactions?.length) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 180 }}>
        <span style={{ fontSize: 48 }}>📊</span>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: '#9CA3AF' }}>No recent transactions</p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.8125rem', color: '#9CA3AF' }}>Start by adding your first transaction!</p>
        <Link to="/transactions" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem', textDecoration: 'none', marginTop: 4 }}>
          Add Transaction →
        </Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px 12px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)' }}>
          Recent Transactions
        </h2>
        <Link to="/transactions" style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem', color: '#4F46E5', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >View All →</Link>
      </div>

      {/* Rows */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '0 24px' }}>
        {transactions.slice(0, 5).map((tx, i) => (
          <li
            key={tx.id}
            className="stagger-item"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              margin: '0',
              borderBottom: i < Math.min(transactions.length, 5) - 1 ? '1px solid var(--color-border)' : 'none',
              animation: 'fadeInUp 0.3s ease both',
              animationDelay: `${i * 0.05}s`,
              cursor: 'default',
              transition: 'background 0.15s ease, padding 0.15s ease, margin 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(79,70,229,0.025)';
              e.currentTarget.style.margin = '0 -24px';
              e.currentTarget.style.padding = '12px 24px';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '';
              e.currentTarget.style.margin = '0';
              e.currentTarget.style.padding = '12px 0';
            }}
          >
            {/* Category icon */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: getCategoryColor(tx.category_name || tx.type),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>
              {tx.category_icon || (tx.type === 'income' ? '📥' : '💳')}
            </div>

            {/* Description + date */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tx.note || tx.description || '—'}
              </p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.8rem', color: '#9CA3AF', marginTop: 1 }}>
                {formatDate(tx.date)}
              </p>
            </div>

            {/* Amount */}
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: '0.9375rem',
              color: tx.type === 'income' ? '#059669' : '#DC2626',
              flexShrink: 0,
            }}>
              {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
