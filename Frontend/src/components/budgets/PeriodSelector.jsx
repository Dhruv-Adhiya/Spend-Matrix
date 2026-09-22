import PropTypes from 'prop-types';
import { IconButton } from '../ui/IconButton';
import { GlassSelect } from '../ui/GlassSelect';
import './PeriodSelector.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function PeriodSelector({ month, year, onMonthChange, onYearChange }) {
  const handlePrevMonth = () => {
    if (month === 1) {
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  };

  // Generate a range of years (e.g., 5 years back, 2 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="period-selector">
      <IconButton 
        icon="ArrowLeft" 
        onClick={handlePrevMonth} 
        aria-label="Previous Month"
        variant="ghost"
      />
      
      <div className="period-dropdowns">
        <GlassSelect
          name="month"
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          options={MONTHS.map((m, index) => ({ value: index + 1, label: m }))}
        />

        <GlassSelect
          name="year"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          options={years.map(y => ({ value: y, label: String(y) }))}
        />
      </div>

      <IconButton 
        icon="ArrowRight" 
        onClick={handleNextMonth} 
        aria-label="Next Month"
        variant="ghost"
      />
    </div>
  );
}

PeriodSelector.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
};
