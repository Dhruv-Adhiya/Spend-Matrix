import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#4F46E5','#10B981','#F59E0B','#EF4444','#8B5CF6','#3B82F6','#EC4899','#14B8A6','#F97316','#84CC16'];

export default function CategoryChart({ data }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: 16 }}>
        Spending by Category
      </h3>
      {!data?.length ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220, fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>
          No expense data for this period
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 260, height: 260 }}>
            <Pie
              data={{
                labels: data.map(d => d.category_name),
                datasets: [{ data: data.map(d => d.total_spent), backgroundColor: COLORS.slice(0, data.length), borderWidth: 2, borderColor: '#fff' }],
              }}
              options={{
                plugins: {
                  legend: { position: 'bottom', labels: { font: { family: '"DM Sans",sans-serif', size: 12 }, padding: 12 } },
                  tooltip: { callbacks: { label: ctx => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}` } },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
