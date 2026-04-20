import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function DailyExpenseChart({ data }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: 4 }}>
        Daily Expense Trend
      </h3>
      {!data?.length ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220, fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>
          No daily expense data available
        </div>
      ) : (
        <div style={{ height: 220 }}>
          <Line
            data={{
              labels: data.map(d => `Day ${new Date(d.date).getDate()}`),
              datasets: [{
                label: 'Daily Expense',
                data: data.map(d => d.total_expense),
                borderColor: '#4F46E5',
                borderWidth: 2.5,
                backgroundColor: (ctx) => {
                  const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
                  gradient.addColorStop(0, 'rgba(79,70,229,0.15)');
                  gradient.addColorStop(1, 'rgba(79,70,229,0)');
                  return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#4F46E5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: '"DM Sans",sans-serif', size: 11 }, color: '#9CA3AF' } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: '"JetBrains Mono",monospace', size: 11 }, color: '#9CA3AF', callback: v => `₹${v}` } },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
