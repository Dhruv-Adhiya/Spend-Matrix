import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { Icon } from '../../components/ui/Icon';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-4)',
      background: 'var(--color-bg-primary)'
    }}>
      <GlassCard style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: 'var(--spacing-6)' }}>
        <div style={{ marginBottom: 'var(--spacing-4)', display: 'flex', justifyContent: 'center', color: 'var(--color-accent-expense)' }}>
          <Icon name="SearchNormal1" size={64} />
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-2)' }}>404</h1>
        <h2 style={{ fontSize: '20px', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-6)' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center' }}>
          <GlassButton variant="secondary" onClick={() => navigate(-1)} icon="ArrowLeft">
            Go Back
          </GlassButton>
          <GlassButton variant="primary" onClick={() => navigate('/dashboard')} icon="Home">
            Dashboard
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
