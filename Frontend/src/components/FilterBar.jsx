import { useEffect, useState } from 'react';
import { getCategories } from '../services/categoryService';

const EMPTY = { type: '', category_id: '', startDate: '', endDate: '', minAmount: '', maxAmount: '', sortBy: 'date', order: 'desc' };

const sel = 'border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300';
const inp = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300';

export default function FilterBar({ filters, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  const isActive = Object.entries(filters).some(([k, v]) =>
    k !== 'sortBy' && k !== 'order' && v !== ''
  );

  const filteredCats = filters.type
    ? categories.filter((c) => c.type === filters.type)
    : categories;

  const dateError =
    filters.startDate && filters.endDate && filters.startDate > filters.endDate;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-end">
      {/* Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Type</label>
        <select name="type" value={filters.type} onChange={(e) => {
          onChange({ ...filters, type: e.target.value, category_id: '' });
        }} className={sel}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Category</label>
        <select name="category_id" value={filters.category_id} onChange={handle} className={sel}>
          <option value="">All Categories</option>
          {filteredCats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">From</label>
        <input type="date" name="startDate" value={filters.startDate} onChange={handle}
          max={filters.endDate || undefined}
          className={`${inp} ${dateError ? 'border-red-400' : ''}`} />
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">To</label>
        <input type="date" name="endDate" value={filters.endDate} onChange={handle}
          min={filters.startDate || undefined}
          className={`${inp} ${dateError ? 'border-red-400' : ''}`} />
        {dateError && <span className="text-xs text-red-500">Invalid range</span>}
      </div>

      {/* Min Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Min ₹</label>
        <input type="number" name="minAmount" value={filters.minAmount} onChange={handle}
          min="0" placeholder="0" className={`${inp} w-24`} />
      </div>

      {/* Max Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Max ₹</label>
        <input type="number" name="maxAmount" value={filters.maxAmount} onChange={handle}
          min="0" placeholder="Any" className={`${inp} w-24`} />
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Sort By</label>
        <select name="sortBy" value={filters.sortBy} onChange={handle} className={sel}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Order</label>
        <select name="order" value={filters.order} onChange={handle} className={sel}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Reset */}
      {isActive && (
        <button
          onClick={() => onChange(EMPTY)}
          className="self-end px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}

export { EMPTY as FILTER_DEFAULTS };
