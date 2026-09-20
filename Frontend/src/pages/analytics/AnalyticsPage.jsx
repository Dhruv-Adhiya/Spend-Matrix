import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { GlassSelect } from '../../components/ui/GlassSelect';
import { analyticsService } from '../../services/analyticsService';
import { MonthlySummaryChart } from '../../components/analytics/MonthlySummaryChart';
import { CategoryDonutChart } from '../../components/analytics/CategoryDonutChart';
import { BudgetVsActualChart } from '../../components/analytics/BudgetVsActualChart';
import { DailyExpenseChart } from '../../components/analytics/DailyExpenseChart';
import { PaymentSourceChart } from '../../components/analytics/PaymentSourceChart';
import './AnalyticsPage.css';

export const AnalyticsPage = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  // State for each chart
  const [monthlySummary, setMonthlySummary] = useState({ data: null, isLoading: true, error: null });
  const [categoryBreakdown, setCategoryBreakdown] = useState({ data: null, isLoading: true, error: null });
  const [budgetVsActual, setBudgetVsActual] = useState({ data: null, isLoading: true, error: null });
  const [dailyExpense, setDailyExpense] = useState({ data: null, isLoading: true, error: null });
  const [paymentSource, setPaymentSource] = useState({ data: null, isLoading: true, error: null });

  // Generate year options (current year down to 5 years ago)
  const currentY = currentDate.getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = (currentY - i).toString();
    return { value: year, label: year };
  });

  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const fetchMonthlySummary = useCallback(async () => {
    setMonthlySummary(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await analyticsService.getMonthlySummary(selectedMonth, selectedYear);
      setMonthlySummary({ data: res.data || res, isLoading: false, error: null });
    } catch (err) {
      setMonthlySummary({ data: null, isLoading: false, error: err });
    }
  }, [selectedMonth, selectedYear]);

  const fetchCategoryBreakdown = useCallback(async () => {
    setCategoryBreakdown(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await analyticsService.getCategoryBreakdown(selectedMonth, selectedYear);
      setCategoryBreakdown({ data: res.data || res, isLoading: false, error: null });
    } catch (err) {
      setCategoryBreakdown({ data: null, isLoading: false, error: err });
    }
  }, [selectedMonth, selectedYear]);

  const fetchBudgetVsActual = useCallback(async () => {
    setBudgetVsActual(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await analyticsService.getBudgetVsActual(selectedMonth, selectedYear);
      setBudgetVsActual({ data: res.data || res, isLoading: false, error: null });
    } catch (err) {
      setBudgetVsActual({ data: null, isLoading: false, error: err });
    }
  }, [selectedMonth, selectedYear]);

  const fetchDailyExpense = useCallback(async () => {
    setDailyExpense(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await analyticsService.getDailyExpense(selectedMonth, selectedYear);
      setDailyExpense({ data: res.data || res, isLoading: false, error: null });
    } catch (err) {
      setDailyExpense({ data: null, isLoading: false, error: err });
    }
  }, [selectedMonth, selectedYear]);

  const fetchPaymentSource = useCallback(async () => {
    setPaymentSource(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await analyticsService.getPaymentSourceBreakdown(selectedMonth, selectedYear);
      setPaymentSource({ data: res.data || res, isLoading: false, error: null });
    } catch (err) {
      setPaymentSource({ data: null, isLoading: false, error: err });
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    // Fetch all data independently
    fetchMonthlySummary();
    fetchCategoryBreakdown();
    fetchBudgetVsActual();
    fetchDailyExpense();
    fetchPaymentSource();
  }, [fetchMonthlySummary, fetchCategoryBreakdown, fetchBudgetVsActual, fetchDailyExpense, fetchPaymentSource]);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Gain deeper insights into your financial behavior.</p>
        </div>
        <div className="analytics-controls">
          <GlassSelect
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={monthOptions}
            icon="Calendar"
          />
          <GlassSelect
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            options={yearOptions}
          />
        </div>
      </div>

      <div className="analytics-grid">
        {/* Full width row for Monthly Summary */}
        <div className="chart-span-full">
          <MonthlySummaryChart 
            data={monthlySummary.data} 
            isLoading={monthlySummary.isLoading} 
            error={monthlySummary.error}
            onRetry={fetchMonthlySummary}
          />
        </div>

        {/* Two column row for Category Donut & Daily Expense */}
        <div className="chart-span-half">
          <CategoryDonutChart 
            data={categoryBreakdown.data} 
            isLoading={categoryBreakdown.isLoading} 
            error={categoryBreakdown.error}
            onRetry={fetchCategoryBreakdown}
          />
        </div>
        <div className="chart-span-half">
          <DailyExpenseChart 
            data={dailyExpense.data} 
            isLoading={dailyExpense.isLoading} 
            error={dailyExpense.error}
            onRetry={fetchDailyExpense}
          />
        </div>

        {/* Full width row for Budget vs Actual */}
        <div className="chart-span-full">
          <BudgetVsActualChart 
            data={budgetVsActual.data} 
            isLoading={budgetVsActual.isLoading} 
            error={budgetVsActual.error}
            onRetry={fetchBudgetVsActual}
          />
        </div>

        {/* Half width for Payment source, leaves one empty grid slot or expands based on css */}
        <div className="chart-span-half">
          <PaymentSourceChart 
            data={paymentSource.data} 
            isLoading={paymentSource.isLoading} 
            error={paymentSource.error}
            onRetry={fetchPaymentSource}
          />
        </div>
      </div>
    </div>
  );
};
