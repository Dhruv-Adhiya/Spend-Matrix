import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { settingsAPI } from '../services/settingsService';

const DATE_FORMATS = ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'];

export default function PreferencesForm({ initialData }) {
  const [form, setForm] = useState({
    currency: initialData?.currency || 'USD',
    timezone: initialData?.timezone || 'UTC',
    date_format: initialData?.date_format || 'YYYY-MM-DD',
    notification_enabled: initialData?.notification_enabled ?? true,
    budget_alert_threshold: initialData?.budget_alert_threshold ?? 80,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const threshold = Number(form.budget_alert_threshold);
    if (!Number.isInteger(threshold) || threshold < 0 || threshold > 100)
      return setError('Budget alert threshold must be between 0 and 100.');
    setLoading(true);
    try {
      await settingsAPI.updatePreferences({ ...form, budget_alert_threshold: threshold });
      setSuccess('Preferences saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <Input label="Currency (e.g. USD, EUR)" name="currency" value={form.currency} onChange={handleChange} maxLength={10} />
      <Input label="Timezone (e.g. UTC, Asia/Kolkata)" name="timezone" value={form.timezone} onChange={handleChange} />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Date Format</label>
        <select
          name="date_format"
          value={form.date_format}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          {DATE_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <Input
        label="Budget Alert Threshold (%)"
        name="budget_alert_threshold"
        type="number"
        min={0}
        max={100}
        value={form.budget_alert_threshold}
        onChange={handleChange}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="notification_enabled"
          checked={form.notification_enabled}
          onChange={handleChange}
          className="w-4 h-4 accent-indigo-600"
        />
        <span className="text-sm font-medium text-gray-700">Enable Email Notifications</span>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <Button loading={loading} type="submit">Save Preferences</Button>
    </form>
  );
}
