import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { GlassButton } from '../../components/ui/GlassButton';
import { Spinner } from '../../components/ui/Spinner';
import { Icon } from '../../components/ui/Icon';
import api from '../../services/api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token');
  const navigate = useNavigate();
  
  const [token, setToken] = useState(urlToken || '');
  const [status, setStatus] = useState(urlToken ? 'verifying' : 'idle'); // idle, verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!urlToken) {
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verifyToken = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        if (err.response?.status === 400 || err.response?.status === 401) {
          setErrorMessage('Your verification link is invalid or has expired.');
        } else {
          setErrorMessage('An error occurred during verification. Please try again later.');
        }
      }
    };

    verifyToken();
  }, [urlToken]);

  const handleManualVerify = async (e) => {
    if (e) e.preventDefault();
    if (!token) {
      setErrorMessage('Please enter a verification token');
      setStatus('error');
      return;
    }

    setStatus('verifying');
    try {
      await api.get(`/auth/verify-email?token=${token}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err.response?.status === 400 || err.response?.status === 401) {
        setErrorMessage('Your verification link is invalid or has expired.');
      } else {
        setErrorMessage('An error occurred during verification. Please try again later.');
      }
    }
  };

  if (status === 'verifying') {
    return (
      <AuthLayout title="Verifying Email" subtitle="Please wait while we verify your email address.">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-6) 0' }}>
          <Spinner size="lg" />
        </div>
      </AuthLayout>
    );
  }

  if (status === 'success') {
    return (
      <AuthLayout title="Email Verified!" subtitle="Your account has been successfully verified.">
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'center' }}>
          <div style={{ color: 'var(--color-accent-income)', marginBottom: 'var(--spacing-2)' }}>
            <Icon name="CheckCircle" size={64} />
          </div>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Thank you for verifying your email. You can now log in to your SpendMatrix account.
          </p>
          <GlassButton variant="primary" onClick={() => navigate('/login')} style={{ width: '100%' }}>
            Go to Login
          </GlassButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Verify Email" subtitle={status === 'error' ? "We couldn't verify your email." : "Enter your verification token"}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'center' }}>
        
        {status === 'error' && (
          <div style={{ color: 'var(--color-accent-expense)', marginBottom: 'var(--spacing-2)' }}>
            <Icon name="XCircle" size={64} />
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5, marginTop: 'var(--spacing-2)' }}>
              {errorMessage}
            </p>
          </div>
        )}

        {!urlToken && status !== 'success' && (
          <form onSubmit={handleManualVerify} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Verification Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your token here"
                style={{
                  width: '100%',
                  padding: '12px 40px',
                  background: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border-glass)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                }}
                required
              />
            </div>
            <GlassButton type="submit" variant="primary" style={{ width: '100%' }}>
              Verify Email
            </GlassButton>
          </form>
        )}

        <GlassButton variant="secondary" onClick={() => navigate('/login')} style={{ width: '100%' }}>
          Back to Login
        </GlassButton>
      </div>
    </AuthLayout>
  );
}
