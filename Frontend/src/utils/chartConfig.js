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

// Register Chart.js components globally
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

// Define global defaults matching the dark glassmorphism theme
ChartJS.defaults.color = '#8b8b9e'; // --color-text-secondary
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(18, 18, 26, 0.9)'; // --color-bg-secondary with opacity
ChartJS.defaults.plugins.tooltip.titleColor = '#f1f1f4'; // --color-text-primary
ChartJS.defaults.plugins.tooltip.bodyColor = '#f1f1f4';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.08)'; // --color-border-glass
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.displayColors = true;

// Grid line defaults for scales
ChartJS.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';
ChartJS.defaults.scale.grid.borderColor = 'rgba(255, 255, 255, 0.05)';
ChartJS.defaults.scale.ticks.color = '#8b8b9e';

export const chartColors = {
  primary: '#8b5cf6', // Violet
  income: '#10b981', // Emerald
  expense: '#f43f5e', // Rose
  warning: '#f59e0b', // Amber
  muted: '#4a4a5e', // Dim Gray
  info: '#3b82f6', // Blue
  // Palette for category donuts
  palette: [
    '#8b5cf6', // Violet
    '#10b981', // Emerald
    '#f43f5e', // Rose
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#84cc16', // Lime
    '#6366f1', // Indigo
    '#d946ef', // Fuchsia
  ]
};
