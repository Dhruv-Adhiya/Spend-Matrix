import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Semantic colors mapping (matches CSS variables)
export const CHART_COLORS = {
  primary: '#8B5CF6',
  income: '#10B981',
  expense: '#F43F5E',
  warning: '#F59E0B',
  info: '#3B82F6',
  neutral: '#6B7280',
  grid: 'rgba(107, 114, 128, 0.1)',
  textPrimary: 'rgba(255, 255, 255, 0.87)',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  tooltipBg: 'rgba(15, 23, 42, 0.9)',
};

// Generates an array of colors for pie/donut charts
export const generateCategoricalColors = (count) => {
  const baseColors = [
    '#8B5CF6', // Purple
    '#3B82F6', // Blue
    '#0EA5E9', // Sky
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#F43F5E', // Rose
    '#D946EF', // Fuchsia
    '#6366F1', // Indigo
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // If we need more colors, repeat with opacity
  const extended = [];
  for (let i = 0; i < count; i++) {
    const color = baseColors[i % baseColors.length];
    // Add opacity if it's a repeated color
    extended.push(i < baseColors.length ? color : `${color}80`);
  }
  return extended;
};

// Common options for standard charts (Bar, Line)
export const getCommonOptions = (isDark = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: isDark ? CHART_COLORS.textSecondary : '#4B5563',
        font: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: isDark ? CHART_COLORS.tooltipBg : '#FFFFFF',
      titleColor: isDark ? '#FFFFFF' : '#111827',
      bodyColor: isDark ? '#FFFFFF' : '#374151',
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: isDark ? CHART_COLORS.textSecondary : '#6B7280',
        font: {
          family: "'Inter', sans-serif",
        }
      }
    },
    y: {
      grid: {
        color: isDark ? CHART_COLORS.grid : 'rgba(0,0,0,0.05)',
        drawBorder: false,
      },
      ticks: {
        color: isDark ? CHART_COLORS.textSecondary : '#6B7280',
        font: {
          family: "'Inter', sans-serif",
        }
      }
    }
  }
});

// Common options for circular charts (Pie, Donut)
export const getCircularOptions = (isDark = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: isDark ? CHART_COLORS.textSecondary : '#4B5563',
        usePointStyle: true,
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: isDark ? CHART_COLORS.tooltipBg : '#FFFFFF',
      titleColor: isDark ? '#FFFFFF' : '#111827',
      bodyColor: isDark ? '#FFFFFF' : '#374151',
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8
    }
  }
});
