import PropTypes from 'prop-types';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { GlassButton } from '../ui/GlassButton';
import { Icon } from '../ui/Icon';
import { EmptyState } from '../ui/EmptyState';
import { IconButton } from '../ui/IconButton';
import { useSettings } from '../../context/SettingsContext';
import './RecurringTable.css';

export function RecurringTable({ rules, onEdit, onDelete, onAdd }) {
  const { formatCurrency } = useSettings();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSource = (source) => {
    if (!source) return '-';
    return source.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (!rules || rules.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <div className="recurring-table-container">
      {/* Desktop View: HTML Table */}
      <div className="recurring-desktop-view">
        <GlassCard padding="none">
          <div className="table-responsive">
            <table className="recurring-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Frequency</th>
                  <th>Schedule</th>
                  <th>Next Run</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <div className="rule-desc">{rule.description}</div>
                      <div className="rule-type">{rule.type === 'income' ? 'Income' : 'Expense'}</div>
                    </td>
                    <td>{rule.category_name || `Category ${rule.category_id}`}</td>
                    <td className={rule.type === 'income' ? 'text-income' : 'text-expense'}>
                      {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
                    </td>
                    <td className="capitalize">{rule.frequency}</td>
                    <td className="schedule-col">
                      <div>Start: {formatDate(rule.start_date)}</div>
                      {rule.end_date && <div>End: {formatDate(rule.end_date)}</div>}
                    </td>
                    <td>{formatDate(rule.next_run_date)}</td>
                    <td>{formatSource(rule.payment_source)}</td>
                    <td>
                      <Badge 
                        type={rule.is_active ? 'success' : 'error'} 
                        text={rule.is_active ? 'Active' : 'Inactive'}
                      />
                    </td>
                    <td className="actions-col">
                      <div className="action-buttons">
                        <IconButton 
                          icon="Edit2" 
                          onClick={() => onEdit(rule)} 
                          aria-label="Edit Rule"
                          size="small"
                        />
                        <IconButton 
                          icon="Trash2" 
                          onClick={() => onDelete(rule)} 
                          aria-label="Delete Rule"
                          variant="danger"
                          size="small"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Mobile View: Cards */}
      <div className="recurring-mobile-view">
        {rules.map((rule) => (
          <GlassCard key={rule.id} className="mobile-rule-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">
                <span className="rule-desc">{rule.description}</span>
                <Badge 
                  type={rule.is_active ? 'success' : 'error'} 
                  text={rule.is_active ? 'Active' : 'Inactive'}
                />
              </div>
              <div className="action-buttons">
                <IconButton 
                  icon="Edit2" 
                  onClick={() => onEdit(rule)} 
                  aria-label="Edit Rule"
                  size="small"
                />
                <IconButton 
                  icon="Trash2" 
                  onClick={() => onDelete(rule)} 
                  aria-label="Delete Rule"
                  variant="danger"
                  size="small"
                />
              </div>
            </div>
            
            <div className="mobile-card-body">
              <div className="mobile-data-row">
                <span className="mobile-label">Amount</span>
                <span className={rule.type === 'income' ? 'text-income' : 'text-expense'}>
                  {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
                </span>
              </div>
              <div className="mobile-data-row">
                <span className="mobile-label">Category</span>
                <span>{rule.category_name || `Category ${rule.category_id}`}</span>
              </div>
              <div className="mobile-data-row">
                <span className="mobile-label">Frequency</span>
                <span className="capitalize">{rule.frequency}</span>
              </div>
              <div className="mobile-data-row">
                <span className="mobile-label">Next Run</span>
                <span>{formatDate(rule.next_run_date)}</span>
              </div>
              <div className="mobile-data-row">
                <span className="mobile-label">Start Date</span>
                <span>{formatDate(rule.start_date)}</span>
              </div>
              {rule.end_date && (
                <div className="mobile-data-row">
                  <span className="mobile-label">End Date</span>
                  <span>{formatDate(rule.end_date)}</span>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

RecurringTable.propTypes = {
  rules: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
