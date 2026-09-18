import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { ChartContainer } from './ChartContainer';
import '../../utils/chartConfig';
import { chartColors } from '../../utils/chartConfig';

export const CategoryDonutChart = ({ data, isLoading, error, onRetry }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    return {
      labels: data.map(item => item.category_name || item.name || 'Unknown'),
      datasets: [
        {
          data: data.map(item => item.total || item.amount || 0),
          backgroundColor: chartColors.palette,
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    };
  }, [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';
            const formattedValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
            return `${context.label}: ${formattedValue} (${percentage})`;
          }
        }
      }
    }
  }), []);

  const isEmpty = !data || !Array.isArray(data) || data.length === 0;

  return (
    <ChartContainer 
      title="Expense by Category" 
      isLoading={isLoading} 
      error={error} 
      isEmpty={isEmpty} 
      onRetry={onRetry}
    >
      {chartData && <Doughnut data={chartData} options={options} />}
    </ChartContainer>
  );
};

CategoryDonutChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  onRetry: PropTypes.func
};
