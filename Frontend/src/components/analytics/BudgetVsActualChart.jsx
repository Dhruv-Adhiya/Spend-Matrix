import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { ChartContainer } from './ChartContainer';
import '../../utils/chartConfig';
import { chartColors } from '../../utils/chartConfig';

export const BudgetVsActualChart = ({ data, isLoading, error, onRetry }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    return {
      labels: data.map(item => item.category_name || `Category ${item.category_id || ''}`),
      datasets: [
        {
          label: 'Budget',
          data: data.map(item => item.budget || item.budget_amount || 0),
          backgroundColor: chartColors.info, // Use a neutral info color for budget target
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        },
        {
          label: 'Actual',
          data: data.map(item => item.spent || item.spent_amount || 0),
          backgroundColor: data.map(item => {
            const spent = item.spent || item.spent_amount || 0;
            const budget = item.budget || item.budget_amount || 0;
            // Red if over budget, Yellow if near (80%), else primary
            if (budget > 0 && spent > budget) return chartColors.expense;
            if (budget > 0 && spent > budget * 0.8) return chartColors.warning;
            return chartColors.primary;
          }),
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }
      ]
    };
  }, [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (value >= 1000) {
              return '₹' + (value / 1000).toFixed(0) + 'k';
            }
            return '₹' + value;
          }
        }
      }
    }
  }), []);

  const isEmpty = !data || !Array.isArray(data) || data.length === 0;

  return (
    <ChartContainer 
      title="Budget vs Actual" 
      isLoading={isLoading} 
      error={error} 
      isEmpty={isEmpty} 
      onRetry={onRetry}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartContainer>
  );
};

BudgetVsActualChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  onRetry: PropTypes.func
};
