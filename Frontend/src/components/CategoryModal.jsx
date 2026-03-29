import { useState } from 'react';
import { createCategory } from '../services/categoryService';

export default function CategoryModal({ onClose, onCreated, defaultType }) {
  const [form, setForm] = useState({ name: '', type: defaultType || 'expense' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError('Name is required.');
    setError('');
    setLoading(true);
    try {
      const created = await createCategory({ name, type: form.type });
      onCreated(created);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create category.';
      setError(
        msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')
          ? 'A category with this name already exists.'
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">New Category</h2>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Travel"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
