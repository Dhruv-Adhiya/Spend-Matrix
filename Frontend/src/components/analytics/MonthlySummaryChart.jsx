import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { ChartContainer } from './ChartContainer';
import '../../utils/chartConfig'; // Initialize Chart.js defaults
import { chartColors } from '../../utils/chartConfig';

export const MonthlySummaryChart = ({ data, isLoading, error, onRetry }) => {
  const chartData = useMemo(() => {
    if (!data) return null;
    
    // Handle both single object or array of objects gracefully
    const dataArray = Array.isArray(data) ? data : [data];
    
    return {
      labels: dataArray.map(item => item.month || 'Selected Period'),
      datasets: [
        {
          label: 'Income',
          data: dataArray.map(item => item.totalIncome || item.income || 0),
          backgroundColor: chartColors.income,
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        },
        {
          label: 'Expense',
          data: dataArray.map(item => item.totalExpense || item.expense || 0),
          backgroundColor: chartColors.expense,
          borderRadius: 4,
          barPercentage: 0.6,
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
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            // Shorten large numbers (e.g., 10000 -> 10k)
            if (value >= 1000) {
              return '₹' + (value / 1000).toFixed(0) + 'k';
            }
            return '₹' + value;
          }
        }
      }
    }
  }), []);

  const isEmpty = !data || (Array.isArray(data) && data.length === 0);

  return (
    <ChartContainer 
      title="Income vs Expense" 
      isLoading={isLoading} 
      error={error} 
      isEmpty={isEmpty} 
      onRetry={onRetry}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartContainer>
  );
};

MonthlySummaryChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  onRetry: PropTypes.func
};
