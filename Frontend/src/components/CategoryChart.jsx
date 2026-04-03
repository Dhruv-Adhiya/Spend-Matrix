import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
];

export default function CategoryChart({ data }) {
  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-center h-64 text-gray-400 text-sm">
        No category data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category_name),
    datasets: [{
      data: data.map((d) => d.total_spent),
      backgroundColor: COLORS.slice(0, data.length),
      borderWidth: 1,
    }],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Category Breakdown</h3>
      <div className="flex justify-center">
        <div style={{ width: 260, height: 260 }}>
          <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>
    </div>
  );
}
