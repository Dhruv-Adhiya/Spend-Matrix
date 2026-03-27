import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import SummaryCard from '../components/SummaryCard';
import TransactionList from '../components/TransactionList';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardAPI
      .getData()
      .then((res) => setData(res.data.data))
      .catch((err) => {
        if (err.response?.status !== 401) {
          setError(err.response?.data?.message || 'Failed to load dashboard data.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {loading && (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard title="Total Balance" amount={data.balance} type="balance" />
            <SummaryCard title="Total Income" amount={data.totalIncome} type="income" />
            <SummaryCard title="Total Expense" amount={data.totalExpense} type="expense" />
          </div>

          <TransactionList transactions={data.recentTransactions} />
        </div>
      )}
    </MainLayout>
  );
}
