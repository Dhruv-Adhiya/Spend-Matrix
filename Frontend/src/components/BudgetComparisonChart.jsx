import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BudgetComparisonChart({ data }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: 2 }}>
        Budget vs. Actual Spending
      </h3>
      <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: 16 }}>
        Compare what you planned vs what you spent
      </p>
      {!data?.length ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>
          No budget data available
        </div>
      ) : (
        <div style={{ height: 280 }}>
          <Bar
            data={{
              labels: data.map(d => d.category_name),
              datasets: [
                {
                  label: 'Budget',
                  data: data.map(d => d.budget_amount),
                  backgroundColor: '#4F46E5',
                  borderRadius: 6,
                },
                {
                  label: 'Actual',
                  data: data.map(d => d.spent_amount),
                  backgroundColor: data.map(d => d.spent_amount > d.budget_amount ? '#EF4444' : '#10B981'),
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top', labels: { font: { family: '"DM Sans",sans-serif', size: 12 }, padding: 16 } },
                tooltip: {
                  callbacks: {
                    label: ctx => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN')}`,
                    afterBody: (items) => {
                      const budget = items.find(i => i.dataset.label === 'Budget')?.raw ?? 0;
                      const actual = items.find(i => i.dataset.label === 'Actual')?.raw ?? 0;
                      if (budget && actual) {
                        const diff = actual - budget;
                        return [`Difference: ${diff >= 0 ? '+' : ''}₹${Math.abs(diff).toLocaleString('en-IN')}`];
                      }
                      return [];
                    },
                  },
                },
              },
              scales: {
                x: { grid: { display: false }, ticks: { font: { family: '"DM Sans",sans-serif', size: 11 }, color: '#9CA3AF' } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: '"JetBrains Mono",monospace', size: 11 }, color: '#9CA3AF', callback: v => `₹${v}` } },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
