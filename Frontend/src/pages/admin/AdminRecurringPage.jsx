import { useState, useEffect } from 'react';
// Removed lucide-react
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Spinner } from '../../components/ui/Spinner';
import { IconButton } from '../../components/ui/IconButton';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import './AdminTable.css'; // Shared table styles

export const AdminRecurringPage = () => {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);

  const fetchRules = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getRecurring();
      setRules(res.data?.data || res.data || []);
    } catch (err) {
      toast.error('Failed to load system recurring rules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleOpenToggle = (rule) => {
    setSelectedRule(rule);
    setIsToggleConfirmOpen(true);
  };

  const handleToggle = async () => {
    if (!selectedRule) return;
    try {
      await adminService.toggleRecurring(selectedRule.id);
      toast.success(`Rule has been ${selectedRule.is_active ? 'disabled' : 'enabled'} globally`);
      fetchRules();
    } catch (err) {
      toast.error('Failed to toggle rule state');
    } finally {
      setIsToggleConfirmOpen(false);
      setSelectedRule(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="admin-page center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">System Recurring Rules</h1>
        <p className="page-subtitle">Monitor and administrate automated transaction rules across the platform.</p>
      </div>

      <div className="admin-table-container">
        {/* Desktop View */}
        <div className="admin-desktop-view">
          <GlassCard padding="none">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rule / Context</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th>Schedule</th>
                    <th>Next Run</th>
                    <th>Status</th>
                    <th className="admin-actions-col">Force Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map(rule => (
                    <tr key={rule.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{rule.description}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          User: {rule.user_name || `ID ${rule.user_id}`}
                        </div>
                      </td>
                      <td style={{ 
                        color: rule.type === 'income' ? 'var(--color-accent-income)' : 'var(--color-accent-expense)',
                        fontWeight: 600
                      }}>
                        {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{rule.frequency}</td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>Start: {formatDate(rule.start_date)}</div>
                        {rule.end_date && <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>End: {formatDate(rule.end_date)}</div>}
                      </td>
                      <td>{formatDate(rule.next_run_date)}</td>
                      <td>
                        <Badge 
                          type={rule.is_active ? 'success' : 'error'} 
                          text={rule.is_active ? 'Active' : 'Inactive'} 
                        />
                      </td>
                      <td className="admin-actions-col">
                        <div className="admin-action-buttons">
                          <IconButton 
                            icon={rule.is_active ? "PowerOff" : "Power"} 
                            onClick={() => handleOpenToggle(rule)} 
                            aria-label={rule.is_active ? "Disable Rule" : "Enable Rule"}
                            size="small"
                            variant={rule.is_active ? "danger" : "primary"}
                            title={rule.is_active ? "Force Disable" : "Force Enable"}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rules.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        No recurring rules found in the system.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Mobile View */}
        <div className="admin-mobile-view">
          {rules.map(rule => (
            <GlassCard key={rule.id} className="admin-mobile-card">
              <div className="admin-mobile-header">
                <div className="admin-mobile-title">
                  <span className="admin-mobile-title-main">{rule.description}</span>
                  <span className="admin-mobile-title-sub">User: {rule.user_name || `ID ${rule.user_id}`}</span>
                </div>
                <div className="admin-action-buttons">
                  <IconButton 
                    icon={rule.is_active ? "PowerOff" : "Power"} 
                    onClick={() => handleOpenToggle(rule)} 
                    aria-label="Toggle Rule"
                    size="small"
                    variant={rule.is_active ? "danger" : "primary"}
                  />
                </div>
              </div>
              <div className="admin-mobile-body">
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Amount</span>
                  <span style={{ 
                    color: rule.type === 'income' ? 'var(--color-accent-income)' : 'var(--color-accent-expense)',
                    fontWeight: 600
                  }}>
                    {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
                  </span>
                </div>
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Frequency</span>
                  <span style={{ textTransform: 'capitalize' }}>{rule.frequency}</span>
                </div>
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Next Run</span>
                  <span>{formatDate(rule.next_run_date)}</span>
                </div>
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Status</span>
                  <Badge 
                    type={rule.is_active ? 'success' : 'error'} 
                    text={rule.is_active ? 'Active' : 'Inactive'} 
                  />
                </div>
              </div>
            </GlassCard>
          ))}
          {rules.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              No recurring rules found in the system.
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isToggleConfirmOpen}
        onClose={() => setIsToggleConfirmOpen(false)}
        onConfirm={handleToggle}
        title={selectedRule?.is_active ? "Disable Recurring Rule" : "Enable Recurring Rule"}
        message={`Are you sure you want to forcibly ${selectedRule?.is_active ? 'disable' : 'enable'} the rule "${selectedRule?.description}" for this user?`}
        confirmText={selectedRule?.is_active ? "Force Disable" : "Force Enable"}
        isDanger={selectedRule?.is_active}
      />
    </div>
  );
};
