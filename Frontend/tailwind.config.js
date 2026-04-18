/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light:   '#818CF8',
          dark:    '#3730A3',
          bg:      '#EEF2FF',
        },
        brand: {
          green:  '#10B981',
          red:    '#EF4444',
          yellow: '#F59E0B',
          blue:   '#3B82F6',
          violet: '#8B5CF6',
        },
      },
      borderRadius: {
        card:   '16px',
        btn:    '10px',
        input:  '10px',
        modal:  '20px',
        badge:  '999px',
      },
      boxShadow: {
        card:  '0 4px 24px rgba(79,70,229,0.08)',
        hover: '0 8px 40px rgba(79,70,229,0.18)',
        glow:  '0 0 40px rgba(79,70,229,0.20)',
      },
    },
  },
  plugins: [],
};
