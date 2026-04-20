import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function PaymentSourceChart({ data }) {
  const entries = data ? Object.entries(data) : [];
  const total = entries.reduce((s, [, v]) => s + Number(v), 0);

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: 16 }}>
        Payment Methods
      </h3>
      {!entries.length ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220, fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>
          No payment source data available
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: 260, height: 260, position: 'relative' }}>
            <Doughnut
              data={{
                labels: entries.map(([k]) => k.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())),
                datasets: [{ data: entries.map(([, v]) => v), backgroundColor: COLORS.slice(0, entries.length), borderWidth: 2, borderColor: '#fff' }],
              }}
              options={{
                cutout: '60%',
                plugins: {
                  legend: { position: 'bottom', labels: { font: { family: '"DM Sans",sans-serif', size: 12 }, padding: 12 } },
                  tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} (${Math.round(ctx.raw / total * 100)}%)` } },
                },
              }}
            />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', textAlign: 'center', pointerEvents: 'none' }}>
              <p style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>{total}</p>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.7rem', color: '#9CA3AF' }}>Transactions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
