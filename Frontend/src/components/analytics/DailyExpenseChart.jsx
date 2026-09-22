import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import api from '../../services/api';
import { GlassCard } from '../ui/GlassCard';
import { Skeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { CHART_COLORS, getCommonOptions } from '../../utils/chartConfig';
import { useTheme } from '../../context/ThemeContext';

export function DailyExpenseChart({ month, year }) {
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
        const res = await api.get(`/analytics/daily-expense?month=${month}&year=${year}`);
        if (isMounted) {
          setData(res.data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load daily expenses');
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
    
    // Sort by date just in case
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = sortedData.map(item => {
      // Format to just day number (e.g. "15") for a cleaner x-axis
      return new Date(item.date).getDate();
    });
    
    const amounts = sortedData.map(item => item.total_spent);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Spent',
          data: amounts,
          borderColor: CHART_COLORS.expense,
          backgroundColor: isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: CHART_COLORS.expense,
          pointBorderColor: isDark ? '#1E293B' : '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4 // Smooth curve
        }
      ]
    };
  }, [data, isDark]);

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
            title: function(context) {
              const day = context[0].label;
              return `${new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            },
            label: function(context) {
              return `Spent: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y)}`;
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
        },
        x: {
          ...baseOptions.scales.x,
          title: {
            display: true,
            text: 'Day of Month',
            color: isDark ? CHART_COLORS.textSecondary : '#6B7280',
            font: { family: "'Inter', sans-serif", size: 11 }
          }
        }
      }
    };
  }, [isDark, month, year]);

  if (isLoading) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Daily Trend</h3>
        <Skeleton height="300px" borderRadius="var(--radius-md)" />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Daily Trend</h3>
        <ErrorState message={error} />
      </GlassCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Daily Trend</h3>
        <EmptyState 
          icon="TrendingUp" 
          title="No Daily Data" 
          description="No expenses found to chart daily trends." 
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full">
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)', margin: 0 }}>Daily Trend</h3>
      <div style={{ height: '300px', position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </GlassCard>
  );
}

DailyExpenseChart.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};
