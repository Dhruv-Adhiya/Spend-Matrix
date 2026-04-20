import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import SummaryCard from '../components/SummaryCard';
import TransactionList from '../components/TransactionList';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const shimmerStyle = {
  background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

function SkeletonCard() {
  return (
    <div style={{ height: 110, borderRadius: 16, ...shimmerStyle }} />
  );
}

function SkeletonRow() {
  return (
    <div style={{ height: 52, borderRadius: 8, ...shimmerStyle }} />
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardAPI.getData()
      .then(res => setData(res.data.data))
      .catch(err => {
        if (err.response?.status !== 401)
          setError(err.response?.data?.message || 'Failed to load dashboard data.');
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || '';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <MainLayout>
      <div className="page-enter">

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text)' }}>
              Welcome,{' '}
              <span className="gradient-text">{firstName}</span>
              {' '}👋
            </h1>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#9CA3AF', marginTop: 2 }}>
              {today}
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="grid-summary">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginTop: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)',
            borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '14px 16px',
            color: '#DC2626', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {!loading && !error && data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="grid-summary">
              <div style={{ animation: 'fadeInUp 0.3s ease both', animationDelay: '0s' }}>
                <SummaryCard title="Total Balance" amount={data.balance} type="balance" />
              </div>
              <div style={{ animation: 'fadeInUp 0.3s ease both', animationDelay: '0.08s' }}>
                <SummaryCard title="Total Income" amount={data.totalIncome} type="income" />
              </div>
              <div style={{ animation: 'fadeInUp 0.3s ease both', animationDelay: '0.16s' }}>
                <SummaryCard title="Total Expense" amount={data.totalExpense} type="expense" />
              </div>
            </div>
            <TransactionList transactions={data.recentTransactions} />
          </div>
        )}

      </div>
    </MainLayout>
  );
}
