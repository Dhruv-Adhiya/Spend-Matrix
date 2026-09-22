import { useState, useEffect } from 'react';
// Removed lucide-react
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Spinner } from '../../components/ui/Spinner';
import { Icon } from '../../components/ui/Icon';
import './AdminDashboardPage.css';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboard();
        setStats(res.data?.data || res.data || {});
      } catch (err) {
        toast.error('Failed to load admin dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-page center">
        <Spinner size="large" />
      </div>
    );
  }

  // We only show metrics returned by the backend.
  // Using generic fallbacks if specific names aren't perfectly matched, but we rely on what's there.
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System-wide overview and metrics.</p>
      </div>

      <div className="admin-stats-grid">
        {stats?.total_users !== undefined && (
          <GlassCard className="admin-stat-card">
            <div className="stat-icon-wrapper blue">
              <Icon name="Users" size={24} />
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stats.total_users}</h3>
              <p className="stat-label">Total Users</p>
            </div>
          </GlassCard>
        )}

        {stats?.total_transactions !== undefined && (
          <GlassCard className="admin-stat-card">
            <div className="stat-icon-wrapper green">
              <Icon name="Database" size={24} />
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stats.total_transactions}</h3>
              <p className="stat-label">Total Transactions</p>
            </div>
          </GlassCard>
        )}

        {stats?.active_recurring !== undefined && (
          <GlassCard className="admin-stat-card">
            <div className="stat-icon-wrapper purple">
              <Icon name="Repeat" size={24} />
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stats.active_recurring}</h3>
              <p className="stat-label">Active Recurring Rules</p>
            </div>
          </GlassCard>
        )}

        {stats?.system_volume !== undefined && (
          <GlassCard className="admin-stat-card">
            <div className="stat-icon-wrapper amber">
              <Icon name="Activity" size={24} />
            </div>
            <div className="stat-info">
              <h3 className="stat-value">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(stats.system_volume)}
              </h3>
              <p className="stat-label">System Volume (INR)</p>
            </div>
          </GlassCard>
        )}
        
        {/* Generic fallback if no specific stats match */}
        {Object.keys(stats || {}).length === 0 && (
          <div className="admin-empty-state">
            <p>No statistics available from the API.</p>
          </div>
        )}
      </div>
    </div>
  );
};
