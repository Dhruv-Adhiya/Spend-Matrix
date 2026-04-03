import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BudgetComparisonChart({ data }) {
  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-center h-64 text-gray-400 text-sm">
        No budget data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category_name),
    datasets: [
      {
        label: 'Budget',
        data: data.map((d) => d.budget_amount),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
      {
        label: 'Spent',
        data: data.map((d) => d.spent_amount),
        backgroundColor: '#f59e0b',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Budget vs Actual</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
