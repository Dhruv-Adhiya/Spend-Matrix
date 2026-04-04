import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { settingsAPI } from '../services/settingsService';

const strengthLabel = (pwd) => {
  if (pwd.length === 0) return null;
  if (pwd.length < 6) return { label: 'Weak', color: 'text-red-500' };
  if (pwd.length < 10) return { label: 'Fair', color: 'text-yellow-500' };
  return { label: 'Strong', color: 'text-green-600' };
};

export default function PasswordForm() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const strength = strengthLabel(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword)
      return setError('All fields are required.');
    if (form.newPassword !== form.confirmPassword)
      return setError('New passwords do not match.');
    if (form.newPassword.length < 8)
      return setError('New password must be at least 8 characters.');
    setLoading(true);
    try {
      await settingsAPI.changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      setSuccess('Password changed successfully.');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <Input label="Current Password" name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} />
      <div className="flex flex-col gap-1">
        <Input label="New Password" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
        {strength && <span className={`text-xs font-medium ${strength.color}`}>Strength: {strength.label}</span>}
      </div>
      <Input label="Confirm New Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
        error={form.confirmPassword && form.newPassword !== form.confirmPassword ? 'Passwords do not match' : ''}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <Button loading={loading} type="submit">Change Password</Button>
    </form>
  );
}
