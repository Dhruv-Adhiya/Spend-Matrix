import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { ChartContainer } from './ChartContainer';
import '../../utils/chartConfig';
import { chartColors } from '../../utils/chartConfig';

export const DailyExpenseChart = ({ data, isLoading, error, onRetry }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    // Sort data by date just in case
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(item => {
        // Just extract the day if it's a full date string like "2023-10-15"
        const d = new Date(item.date || item.transaction_date);
        return isNaN(d.getTime()) ? (item.date || item.transaction_date || '') : d.getDate().toString();
      }),
      datasets: [
        {
          label: 'Daily Expense',
          data: sortedData.map(item => item.total || item.amount || 0),
          borderColor: chartColors.primary,
          backgroundColor: 'rgba(139, 92, 246, 0.1)', // primary with opacity
          borderWidth: 2,
          pointBackgroundColor: chartColors.primary,
          pointBorderColor: 'rgba(255,255,255,0.8)',
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.3 // Smooth curves
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
        display: false // Hide legend since it's just one line
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => `Day ${tooltipItems[0].label}`,
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
        grid: {
          display: false // Cleaner look without vertical grid lines
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
      title="Daily Expense Trend" 
      isLoading={isLoading} 
      error={error} 
      isEmpty={isEmpty} 
      onRetry={onRetry}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartContainer>
  );
};

DailyExpenseChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  onRetry: PropTypes.func
};
