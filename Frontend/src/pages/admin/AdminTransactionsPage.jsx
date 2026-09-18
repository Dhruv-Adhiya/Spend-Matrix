import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import './AdminTable.css'; // Shared table styles

export const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await adminService.getTransactions();
        setTransactions(res.data?.data || res.data || []);
      } catch (err) {
        toast.error('Failed to load system transactions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        <h1 className="page-title">Global Transactions</h1>
        <p className="page-subtitle">View all transactions flowing through the system.</p>
      </div>

      <div className="admin-table-container">
        {/* Desktop View */}
        <div className="admin-desktop-view">
          <GlassCard padding="none">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.user_name || `User ${t.user_id}`}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{t.user_email}</div>
                      </td>
                      <td>{formatDate(t.date)}</td>
                      <td>{t.description}</td>
                      <td>
                        <Badge 
                          type={t.type === 'income' ? 'success' : 'default'}
                          text={t.category_name || 'Uncategorized'}
                        />
                      </td>
                      <td style={{ 
                        color: t.type === 'income' ? 'var(--color-accent-income)' : 'var(--color-accent-expense)',
                        fontWeight: 600
                      }}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{t.payment_source?.replace('_', ' ')}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        No transactions found in the system.
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
          {transactions.map(t => (
            <GlassCard key={t.id} className="admin-mobile-card">
              <div className="admin-mobile-header">
                <div className="admin-mobile-title">
                  <span className="admin-mobile-title-main">{t.user_name || `User ${t.user_id}`}</span>
                  <span className="admin-mobile-title-sub">{t.description}</span>
                </div>
                <div style={{ 
                  color: t.type === 'income' ? 'var(--color-accent-income)' : 'var(--color-accent-expense)',
                  fontWeight: 600,
                  fontSize: '1.125rem'
                }}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
              <div className="admin-mobile-body">
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Date</span>
                  <span>{formatDate(t.date)}</span>
                </div>
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Category</span>
                  <span>{t.category_name || 'Uncategorized'}</span>
                </div>
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Source</span>
                  <span style={{ textTransform: 'capitalize' }}>{t.payment_source?.replace('_', ' ')}</span>
                </div>
              </div>
            </GlassCard>
          ))}
          {transactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              No transactions found in the system.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
