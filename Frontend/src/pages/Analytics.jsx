import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout';
import FilterBar from '../components/FilterBar';
import SummaryCard from '../components/SummaryCard';
import CategoryChart from '../components/CategoryChart';
import PaymentSourceChart from '../components/PaymentSourceChart';
import DailyExpenseChart from '../components/DailyExpenseChart';
import BudgetComparisonChart from '../components/BudgetComparisonChart';
import analyticsAPI from '../services/analyticsService';

const now = new Date();

const defaultFilters = {
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  payment_source: '',
};

export default function Analytics() {
  const [filters, setFilters] = useState(defaultFilters);
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [paymentData, setPaymentData] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    const { month, year, payment_source } = filters;
    if (!month || !year) return;

    const params = { month, year };
    if (payment_source) params.payment_source = payment_source;

    setLoading(true);
    setError('');

    try {
      const [summaryRes, categoryRes, paymentRes, dailyRes, budgetRes] = await Promise.all([
        analyticsAPI.getMonthlySummary(params),
        analyticsAPI.getCategoryBreakdown(params),
        analyticsAPI.getPaymentSourceBreakdown(),
        analyticsAPI.getDailyExpense(params),
        analyticsAPI.getBudgetVsActual({ month, year }),
      ]);

      setSummary(summaryRes.data.data);
      setCategoryData(categoryRes.data.data ?? []);
      setPaymentData(paymentRes.data.data ?? {});
      setDailyData(dailyRes.data.data ?? []);
      setBudgetData(budgetRes.data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-800">Analytics</h1>

        <FilterBar filters={filters} onChange={setFilters} />

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard title="Total Income" amount={summary?.total_income ?? 0} type="income" />
              <SummaryCard title="Total Expense" amount={summary?.total_expense ?? 0} type="expense" />
              <SummaryCard title="Savings" amount={summary?.savings ?? 0} type="balance" />
            </div>

            {/* Pie Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CategoryChart data={categoryData} />
              <PaymentSourceChart data={paymentData} />
            </div>

            {/* Daily Expense Line Chart */}
            <DailyExpenseChart data={dailyData} />

            {/* Budget vs Actual Bar Chart */}
            <BudgetComparisonChart data={budgetData} />
          </>
        )}
      </div>
    </MainLayout>
  );
}
