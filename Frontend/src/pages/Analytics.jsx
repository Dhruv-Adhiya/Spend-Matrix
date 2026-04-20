import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout';
import SummaryCard from '../components/SummaryCard';
import CategoryChart from '../components/CategoryChart';
import PaymentSourceChart from '../components/PaymentSourceChart';
import DailyExpenseChart from '../components/DailyExpenseChart';
import BudgetComparisonChart from '../components/BudgetComparisonChart';
import analyticsAPI from '../services/analyticsService';

const now = new Date();
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'].map((l,i) => ({ label: l, value: i+1 }));
const years = [2023,2024,2025,2026,2027].map(y => ({ label: String(y), value: y }));

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
      <div className="page-enter">
        <h1 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: '1.5rem', marginBottom: 16 }}>Analytics</h1>

        {/* Filter Bar */}
        <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[['Month','month',months,150],['Year','year',years,110]].map(([label,key,opts,w]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: '#374151', marginBottom: 4 }}>{label}</label>
                <select value={filters[key]} onChange={e => setFilters(f => ({ ...f, [key]: Number(e.target.value) }))} className="input" style={{ width: w }}>
                  {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: '#374151', marginBottom: 4 }}>Payment Source</label>
              <select value={filters.payment_source} onChange={e => setFilters(f => ({ ...f, payment_source: e.target.value }))} className="input" style={{ width: 160 }}>
                <option value="">All Sources</option>
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>
            <button onClick={fetchAll} className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '0.875rem' }}>Apply Filters</button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 256, gap: 12 }}>
            <span className="spinner" />
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF', marginTop: 12 }}>Loading analytics...</p>
          </div>
        ) : (
          <>
            <div className="grid-summary" style={{ marginBottom: 20 }}>
              <SummaryCard title="Total Income" amount={summary?.total_income ?? 0} type="income" />
              <SummaryCard title="Total Expense" amount={summary?.total_expense ?? 0} type="expense" />
              <SummaryCard title="Savings" amount={summary?.savings ?? 0} type="balance" />
            </div>
            <div className="grid-charts-2" style={{ marginBottom: 16 }}>
              <CategoryChart data={categoryData} />
              <PaymentSourceChart data={paymentData} />
            </div>
            <DailyExpenseChart data={dailyData} />
            <div style={{ marginTop: 16 }}><BudgetComparisonChart data={budgetData} /></div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
