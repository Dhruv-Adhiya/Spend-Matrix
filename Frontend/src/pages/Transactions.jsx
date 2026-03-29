import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import CategoryDropdown from '../components/CategoryDropdown';
import { transactionAPI } from '../services/api';

const EMPTY = {
  type: 'expense',
  amount: '',
  category_id: '',
  description: '',
  transaction_date: new Date().toISOString().split('T')[0],
  payment_source: 'online',
};

function TransactionModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(
    isEdit
      ? {
          type: initial.type,
          amount: initial.amount,
          category_id: String(initial.category_id),
          description: initial.description || '',
          transaction_date: initial.transaction_date?.split('T')[0] ?? initial.transaction_date,
          payment_source: initial.payment_source,
        }
      : EMPTY
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleTypeChange = (e) =>
    setForm((f) => ({ ...f, type: e.target.value, category_id: '' }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id) return setError('Please select a category.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.transaction_date) return setError('Date is required.');
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount), category_id: Number(form.category_id) };
      if (isEdit) {
        await transactionAPI.update(initial.id, payload);
      } else {
        await transactionAPI.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select value={form.type} onChange={handleTypeChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
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

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Amount (₹)</label>
            <input type="number" min="0.01" step="0.01" value={form.amount}
              onChange={(e) => set('amount', e.target.value)} placeholder="0.00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input type="date" value={form.transaction_date}
              onChange={(e) => set('transaction_date', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Payment Source</label>
            <select value={form.payment_source} onChange={(e) => set('payment_source', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={2} placeholder="Add a note…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-60">
              {loading ? 'Saving…' : isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 text-center">
        <p className="text-sm text-gray-700 mb-4">Delete this transaction?</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-60">
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

const SOURCE_LABEL = { online: 'Online', cash: 'Cash', credit_card: 'Credit Card' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactions = () => {
    setLoading(true);
    transactionAPI
      .getAll({ limit: 50 })
      .then((r) => setTransactions(r.data.data.transactions || []))
      .catch(() => setError('Failed to load transactions.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await transactionAPI.remove(deleteTarget.id);
      setDeleteTarget(null);
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction.');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Transaction
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400 text-sm">
          No transactions yet. Click "+ Add Transaction" to get started.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(tx.transaction_date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}₹
                    {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{SOURCE_LABEL[tx.payment_source] || tx.payment_source}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{tx.description || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { setEditTarget(tx); setShowModal(true); }}
                      className="text-indigo-500 hover:text-indigo-700 text-xs font-medium mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tx)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <TransactionModal
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSaved={fetchTransactions}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </MainLayout>
  );
}
