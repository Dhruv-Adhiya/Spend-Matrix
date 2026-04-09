import { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import FrequencySelector from './FrequencySelector';

const CREATE_DEFAULTS = {
  type: 'expense',
  category_id: '',
  amount: '',
  frequency: '',
  start_date: '',
  end_date: '',
  description: '',
  payment_source: 'online',
};

export default function RecurringForm({ initial, onSubmit, onCancel, loading }) {
  const isEdit = !!initial;

  const [form, setForm] = useState(
    isEdit
      ? {
          amount: initial.amount,
          frequency: initial.frequency,
          end_date: initial.end_date?.split('T')[0] ?? '',
          description: initial.description || '',
          payment_source: initial.payment_source || 'online',
          // read-only display fields
          type: initial.type,
          category_id: String(initial.category_id),
          start_date: initial.start_date?.split('T')[0] ?? '',
        }
      : CREATE_DEFAULTS
  );
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEdit && !form.category_id) return setError('Please select a category.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.frequency) return setError('Frequency is required.');
    if (!isEdit && !form.start_date) return setError('Start date is required.');
    if (form.end_date && form.start_date && form.end_date < form.start_date)
      return setError('End date must be on or after start date.');
    setError('');

    if (isEdit) {
      // Only send fields the backend update endpoint accepts
      onSubmit({
        amount: Number(form.amount),
        frequency: form.frequency,
        end_date: form.end_date || null,
        description: form.description,
        payment_source: form.payment_source,
      });
    } else {
      onSubmit({
        type: form.type,
        category_id: Number(form.category_id),
        amount: Number(form.amount),
        frequency: form.frequency,
        start_date: form.start_date,
        end_date: form.end_date || null,
        description: form.description,
        payment_source: form.payment_source,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Create-only fields */}
      {!isEdit && (
        <>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, category_id: '' }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <CategoryDropdown
              value={form.category_id}
              onChange={(val) => set('category_id', val)}
              type={form.type}
            />
          </div>
        </>
      )}

      {/* Edit mode: show read-only info */}
      {isEdit && (
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 flex gap-4">
          <span>
            Type: <span className="font-medium text-gray-700 capitalize">{form.type}</span>
          </span>
          <span>
            Category: <span className="font-medium text-gray-700">{initial.category_name ?? `#${initial.category_id}`}</span>
          </span>
          <span>
            Started: <span className="font-medium text-gray-700">{form.start_date || '—'}</span>
          </span>
        </div>
      )}

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Amount (₹)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
          placeholder="0.00"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Frequency</label>
        <FrequencySelector value={form.frequency} onChange={(val) => set('frequency', val)} />
      </div>

      {!isEdit && (
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => set('start_date', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      )}

      <div>
        <label className="text-xs text-gray-500 mb-1 block">End Date (optional)</label>
        <input
          type="date"
          value={form.end_date}
          min={form.start_date || undefined}
          onChange={(e) => set('end_date', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Payment Source</label>
        <select
          value={form.payment_source}
          onChange={(e) => set('payment_source', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="online">Online</option>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={2}
          placeholder="Add a note…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? 'Saving…' : isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
