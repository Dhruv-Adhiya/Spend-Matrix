import { useState } from 'react';
import { PeriodSelector } from '../../components/budgets/PeriodSelector';
import { MonthlySummaryChart } from '../../components/analytics/MonthlySummaryChart';
import { CategoryBreakdownChart } from '../../components/analytics/CategoryBreakdownChart';
import { DailyExpenseChart } from '../../components/analytics/DailyExpenseChart';
import { BudgetVsActualChart } from '../../components/analytics/BudgetVsActualChart';
import { PaymentSourceChart } from '../../components/analytics/PaymentSourceChart';
import './AnalyticsPage.css';

export function AnalyticsPage() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  return (
    <div className="analytics-page animate-fade-in">
      <div className="analytics-header mb-6">
        <div>
          <h2 className="section-title">Analytics</h2>
          <p className="section-subtitle-muted mt-1">Deep dive into your spending patterns.</p>
        </div>
        
        <div className="period-selector-wrapper">
          <PeriodSelector 
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>
      </div>

      <div className="analytics-grid">
        {/* Top Row: High-level summaries */}
        <div className="analytics-grid-col-2">
          <MonthlySummaryChart month={month} year={year} />
        </div>
        <div className="analytics-grid-col-1">
          <CategoryBreakdownChart month={month} year={year} />
        </div>

        {/* Middle Row: Trend over time (spans full width on desktop) */}
        <div className="analytics-grid-col-full">
          <DailyExpenseChart month={month} year={year} />
        </div>

        {/* Bottom Row: Detailed breakdowns */}
        <div className="analytics-grid-col-2">
          <BudgetVsActualChart month={month} year={year} />
        </div>
        <div className="analytics-grid-col-1">
          <PaymentSourceChart month={month} year={year} />
        </div>
      </div>
    </div>
  );
}
