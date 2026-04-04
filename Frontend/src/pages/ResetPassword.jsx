import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { authAPI } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.newPassword || !form.confirmPassword) return setError('All fields are required.');
    if (form.newPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match.');
    if (!token) return setError('Invalid or missing reset token.');

    setLoading(true);
    try {
      await authAPI.resetPassword({ token, newPassword: form.newPassword });
      setSuccess('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <p className="text-red-600 text-sm mb-4">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-indigo-600 hover:underline text-sm">Request a new link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Reset Password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your new password below.</p>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Min. 6 characters"
            value={form.newPassword}
            onChange={handleChange}
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat new password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={form.confirmPassword && form.newPassword !== form.confirmPassword ? 'Passwords do not match' : ''}
          />
          <Button type="submit" loading={loading}>Reset Password</Button>
        </form>
      </div>
    </div>
  );
}
