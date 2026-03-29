import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import CategoryDropdown from '../components/CategoryDropdown';
import { transactionAPI } from '../services/api';

const INITIAL = {
  type: 'expense',
  amount: '',
  category_id: '',
  description: '',
  transaction_date: new Date().toISOString().split('T')[0],
  payment_source: 'online',
};

export default function Transactions() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setForm((f) => ({ ...f, type: newType, category_id: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.category_id) return setError('Please select a category.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.transaction_date) return setError('Date is required.');

    setLoading(true);
    try {
      await transactionAPI.create({
        ...form,
        amount: Number(form.amount),
        category_id: Number(form.category_id),
      });
      setSuccess('Transaction added successfully.');
      setForm(INITIAL);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Add Transaction</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}
        {success && (
          <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Type */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select
              value={form.type}
              onChange={handleTypeChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <CategoryDropdown
              value={form.category_id}
              onChange={(val) => set('category_id', val)}
              type={form.type}
            />
          </div>

          {/* Amount */}
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

          {/* Date */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input
              type="date"
              value={form.transaction_date}
              onChange={(e) => set('transaction_date', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Payment Source */}
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

          {/* Description */}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
