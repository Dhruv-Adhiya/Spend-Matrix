import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function DailyExpenseChart({ data }) {
  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-center h-64 text-gray-400 text-sm">
        No daily expense data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })),
    datasets: [{
      label: 'Daily Expense',
      data: data.map((d) => d.total_expense),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
    }],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Daily Expense Trend</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}
