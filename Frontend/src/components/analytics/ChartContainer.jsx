import PropTypes from 'prop-types';
import { GlassCard } from '../ui/GlassCard';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import './ChartContainer.css';

export const ChartContainer = ({ title, isLoading, error, isEmpty, emptyMessage, onRetry, children, height = 300 }) => {
  return (
    <GlassCard className="chart-container-card">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-content" style={{ height: `${height}px` }}>
        {isLoading ? (
          <div className="chart-center-content">
            <Spinner size="large" color="var(--color-accent-primary)" />
          </div>
        ) : error ? (
          <div className="chart-center-content">
            <ErrorState 
              title="Failed to load chart" 
              message={error.message || 'An error occurred'} 
              onRetry={onRetry} 
            />
          </div>
        ) : isEmpty ? (
          <div className="chart-center-content">
            <EmptyState 
              title="No Data" 
              description={emptyMessage || 'No data available for this period.'} 
              icon="chart"
            />
          </div>
        ) : (
          <div className="chart-render-area">
            {children}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  isEmpty: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onRetry: PropTypes.func,
  children: PropTypes.node,
  height: PropTypes.number
};
