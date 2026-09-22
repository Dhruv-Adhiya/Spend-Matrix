import PropTypes from 'prop-types';
import { GlassInput } from '../ui/GlassInput';
import { GlassSelect } from '../ui/GlassSelect';
import { GlassButton } from '../ui/GlassButton';
import { Icon } from '../ui/Icon';
import './TransactionFilters.css';

export function TransactionFilters({ filters, setFilters, categories, onReset }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filters-container">
      <div className="filters-search-bar">
        <GlassInput
          icon="Search"
          placeholder="Search descriptions..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>
      
      <div className="filters-row">
        <div className="filter-group">
          <label className="filter-label">Type</label>
          <GlassSelect
            name="type"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' }
            ]}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <GlassSelect
            name="category_id"
            value={filters.category_id}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Min Amount</label>
          <input 
            type="number"
            className="glass-input-native"
            placeholder="Min"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Max Amount</label>
          <input 
            type="number"
            className="glass-input-native"
            placeholder="Max"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Start Date</label>
          <input 
            type="date"
            className="glass-input-native"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">End Date</label>
          <input 
            type="date"
            className="glass-input-native"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        <div className="filter-group actions">
          <label className="filter-label">&nbsp;</label>
          <GlassButton variant="secondary" onClick={onReset} className="reset-btn">
            <Icon name="X" size={16} style={{ marginRight: '4px' }} /> Reset
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

TransactionFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    type: PropTypes.string,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onReset: PropTypes.func.isRequired,
};
