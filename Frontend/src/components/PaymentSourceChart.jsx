import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'];

export default function PaymentSourceChart({ data }) {
  const entries = data ? Object.entries(data) : [];

  if (!entries.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-center h-64 text-gray-400 text-sm">
        No payment source data available
      </div>
    );
  }

  const chartData = {
    labels: entries.map(([k]) => k.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())),
    datasets: [{
      data: entries.map(([, v]) => v),
      backgroundColor: COLORS.slice(0, entries.length),
      borderWidth: 1,
    }],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Payment Source Breakdown</h3>
      <div className="flex justify-center">
        <div style={{ width: 260, height: 260 }}>
          <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>
    </div>
  );
}
