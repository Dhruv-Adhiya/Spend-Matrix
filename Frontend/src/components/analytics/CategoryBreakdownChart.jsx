import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import { GlassCard } from '../ui/GlassCard';
import { Skeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { generateCategoricalColors, getCircularOptions } from '../../utils/chartConfig';
import { useTheme } from '../../context/ThemeContext';

export function CategoryBreakdownChart({ month, year }) {
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
        const res = await api.get(`/analytics/category-breakdown?month=${month}&year=${year}`);
        if (isMounted) {
          setData(res.data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load category breakdown');
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
    const amounts = data.map(item => item.total_spent);
    const backgroundColors = generateCategoricalColors(data.length);

    return {
      labels,
      datasets: [
        {
          data: amounts,
          backgroundColor: backgroundColors,
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    };
  }, [data]);

  const options = useMemo(() => {
    const baseOptions = getCircularOptions(isDark);
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
              
              // Calculate percentage manually since dataset doesn't have it explicitly bound
              const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              
              return `${label}: ${formattedValue} (${percentage}%)`;
            }
          }
        }
      }
    };
  }, [isDark]);

  if (isLoading) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Category Breakdown</h3>
        <Skeleton height="250px" borderRadius="var(--radius-md)" />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Category Breakdown</h3>
        <ErrorState message={error} />
      </GlassCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassCard className="h-full">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Category Breakdown</h3>
        <EmptyState 
          icon="PieChart" 
          title="No Categories" 
          description="No expenses found for this month." 
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full">
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)', margin: 0 }}>Category Breakdown</h3>
      <div style={{ height: '250px', position: 'relative' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </GlassCard>
  );
}

CategoryBreakdownChart.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};
