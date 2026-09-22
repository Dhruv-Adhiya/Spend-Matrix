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

export function BudgetVsActualChart({ month, year }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/analytics/budget-vs-actual?month=${month}&year=${year}`);
        if (isMounted) {
          setData(res.data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load budget comparison');
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
    if (!data || data.length === 0) return null;
    
    const labels = data.map(item => item.category_name);
    const budgetAmounts = data.map(item => item.budget_amount);
    const actualAmounts = data.map(item => item.actual_amount);

    return {
      labels,
      datasets: [
        {
          label: 'Budget',
          data: budgetAmounts,
          backgroundColor: isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(107, 114, 128, 0.3)',
          borderRadius: 4,
        },
        {
          label: 'Actual',
          data: actualAmounts,
          backgroundColor: CHART_COLORS.expense,
          borderRadius: 4,
        }
      ]
    };
  }, [data, isDark]);

  const options = useMemo(() => {
    const baseOptions = getCommonOptions(isDark);
    return {
      ...baseOptions,
      indexAxis: 'y', // Horizontal bar chart
      plugins: {
        ...baseOptions.plugins,
        legend: {
          ...baseOptions.plugins.legend,
          position: 'top',
          align: 'end',
        },
        tooltip: {
          ...baseOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.x;
              return `${label}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ...baseOptions.scales.y, // Swap grid styling for horizontal
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
        },
        y: {
          ...baseOptions.scales.x, // Swap grid styling for horizontal
        }
      }
    };
  }, [isDark]);

  if (isLoading) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Budget vs Actual</h3>
        <Skeleton height="300px" borderRadius="var(--radius-md)" />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Budget vs Actual</h3>
        <ErrorState message={error} />
      </GlassCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Budget vs Actual</h3>
        <EmptyState 
          icon="BarChart2" 
          title="No Budget Data" 
          description="Set up budgets to compare them against actual spending." 
        />
      </GlassCard>
    );
  }

  // Adjust height dynamically based on number of categories to prevent squishing
  const dynamicHeight = Math.max(300, data.length * 40);

  return (
    <GlassCard className="h-full">
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)', margin: 0 }}>Budget vs Actual</h3>
      <div style={{ height: `${dynamicHeight}px`, position: 'relative' }}>
        <Bar data={chartData} options={options} />
      </div>
    </GlassCard>
  );
}

BudgetVsActualChart.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};
