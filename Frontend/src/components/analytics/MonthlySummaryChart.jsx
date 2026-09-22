import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import api from '../../services/api';
import { GlassCard } from '../ui/GlassCard';
import { Skeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { CHART_COLORS, getCommonOptions } from '../../utils/chartConfig';
import { useTheme } from '../../context/ThemeContext';

export function MonthlySummaryChart({ month, year }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/analytics/monthly-summary?month=${month}&year=${year}`);
        if (isMounted) {
          setData(res.data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load monthly summary');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [month, year]);

  const chartData = useMemo(() => {
    if (!data) return null;
    
    return {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          label: 'Amount ($)',
          data: [data.total_income || 0, data.total_expense || 0],
          backgroundColor: [
            CHART_COLORS.income,
            CHART_COLORS.expense
          ],
          borderRadius: 4,
          barThickness: 40,
        }
      ]
    };
  }, [data]);

  const options = useMemo(() => {
    const baseOptions = getCommonOptions(isDark);
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: { display: false },
        tooltip: {
          ...baseOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        ...baseOptions.scales,
        y: {
          ...baseOptions.scales.y,
          beginAtZero: true,
          ticks: {
            ...baseOptions.scales.y.ticks,
            callback: function(value) {
              if (value >= 1000) {
                return '$' + (value / 1000).toFixed(1) + 'k';
              }
              return '$' + value;
            }
          }
        }
      }
    };
  }, [isDark]);

  if (isLoading) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Monthly Summary</h3>
        <Skeleton height="200px" borderRadius="var(--radius-md)" />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Monthly Summary</h3>
        <ErrorState message={error} />
      </GlassCard>
    );
  }

  if (!data || (data.total_income === 0 && data.total_expense === 0)) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Monthly Summary</h3>
        <EmptyState 
          icon="Wallet" 
          title="No Data" 
          description="No transactions found for this month." 
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Monthly Summary</h3>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Net Balance</div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            color: (data.total_income - data.total_expense) >= 0 ? 'var(--color-accent-income)' : 'var(--color-accent-expense)' 
          }}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.total_income - data.total_expense)}
          </div>
        </div>
      </div>
      <div style={{ height: '200px', position: 'relative' }}>
        <Bar data={chartData} options={options} />
      </div>
    </GlassCard>
  );
}

MonthlySummaryChart.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};
