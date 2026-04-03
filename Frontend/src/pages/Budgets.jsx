import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { budgetAPI } from '../services/api';
import { getCategories } from '../services/categoryService';

const now = new Date();

const EMPTY = { category_id: '', amount: '', month: now.getMonth() + 1, year: now.getFullYear() };

function BudgetModal({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats.filter((c) => c.type === 'expense')))
      .catch(() => setError('Failed to load categories.'));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id) return setError('Select a category.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be > 0.');
    setError('');
    setLoading(true);
    try {
      await budgetAPI.save({
        category_id: Number(form.category_id),
        amount: Number(form.amount),
        month: Number(form.month),
        year: Number(form.year),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget.');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Set Budget</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Expense Category</label>
            <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Budget Amount (₹)</label>
            <input type="number" min="0.01" step="0.01" value={form.amount}
              onChange={(e) => set('amount', e.target.value)} placeholder="0.00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Month</label>
              <select value={form.month} onChange={(e) => set('month', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Year</label>
              <input type="number" min="2000" max="2100" value={form.year}
                onChange={(e) => set('year', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-60">
              {loading ? 'Saving…' : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProgressBar({ pct, over }) {
  const clamped = Math.min(pct, 100);
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div
        className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-400' : 'bg-indigo-500'}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = () => {
    setLoading(true);
    setError('');
    Promise.all([budgetAPI.getAll(month, year), budgetAPI.getSummary(month, year)])
      .then(([b, s]) => {
        setBudgets(b.data.data || []);
        setSummary(s.data.data);
      })
      .catch(() => setError('Failed to load budgets.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBudgets(); }, [month, year]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await budgetAPI.remove(deleteId);
      setDeleteId(null);
      fetchBudgets();
    } catch {
      setError('Failed to delete budget.');
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Budgets</h1>
        <div className="flex items-center gap-3">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" min="2000" max="2100" value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
            + Set Budget
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

      {/* Summary bar */}
      {summary && summary.total_budget > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-5 flex gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-400">Total Budget</p>
            <p className="font-semibold text-gray-800">₹{fmt(summary.total_budget)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Spent</p>
            <p className={`font-semibold ${summary.total_spent > summary.total_budget ? 'text-red-500' : 'text-gray-800'}`}>
              ₹{fmt(summary.total_spent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Remaining</p>
            <p className={`font-semibold ${summary.remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
              ₹{fmt(summary.remaining)}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
      ) : budgets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400 text-sm">
          No budgets for this period. Click "+ Set Budget" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const over = b.spent > b.budget;
            return (
              <div key={b.category_id}
                className={`bg-white rounded-xl shadow-sm p-4 border ${over ? 'border-red-200' : 'border-transparent'}`}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{b.category_name}</p>
                    {over && (
                      <span className="text-xs text-red-500 font-medium">⚠ Over budget</span>
                    )}
                  </div>
                  <button onClick={() => setDeleteId(b.id)}
                    className="text-gray-300 hover:text-red-400 text-xs transition">✕</button>
                </div>

                <ProgressBar pct={b.percentage_used} over={over} />

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Spent: <span className={`font-medium ${over ? 'text-red-500' : 'text-gray-700'}`}>₹{fmt(b.spent)}</span></span>
                  <span>Budget: <span className="font-medium text-gray-700">₹{fmt(b.budget)}</span></span>
                </div>
                <p className={`text-xs mt-1 ${b.remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {b.remaining < 0
                    ? `Over by ₹${fmt(Math.abs(b.remaining))}`
                    : `₹${fmt(b.remaining)} remaining`}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{b.percentage_used}% used</p>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <BudgetModal onClose={() => setShowModal(false)} onSaved={fetchBudgets} />
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 text-center">
            <p className="text-sm text-gray-700 mb-4">Delete this budget?</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-60">
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
