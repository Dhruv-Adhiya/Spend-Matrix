import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { settingsAPI } from '../services/settingsService';

export default function ProfileForm({ initialData }) {
  const [form, setForm] = useState({ full_name: initialData?.full_name || '', email: initialData?.email || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.full_name.trim() || !form.email.trim()) return setError('All fields are required.');
    setLoading(true);
    try {
      await settingsAPI.updateProfile(form);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <Button loading={loading} type="submit">Save Profile</Button>
    </form>
  );
}
