import { useEffect, useState } from 'react';
import { getCategories } from '../services/categoryService';
import SearchBar from './SearchBar';
import ExportButtons from './ExportButtons';

export const FILTER_DEFAULTS = {
  type: '', category_id: '', startDate: '', endDate: '',
  payment_source: '', sortBy: 'date', order: 'desc',
};

const labelStyle = {
  fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
  fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 4, display: 'block',
};

const selectStyle = {
  fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.9375rem',
  background: '#FAFBFF', border: '1.5px solid #E5E7EB', borderRadius: 10,
  padding: '11px 14px', color: '#111827', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', cursor: 'pointer',
};

function FilterField({ label, width, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function FilterBar({ filters, onChange, search, onSearch, exportFilters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  const handle = (key, val) => onChange({ ...filters, [key]: val });

  const filteredCats = filters.type
    ? categories.filter(c => c.type === filters.type)
    : categories;

  const isActive = search || Object.entries(filters).some(([k, v]) =>
    k !== 'sortBy' && k !== 'order' && v !== ''
  );

  const clearAll = () => {
    onChange(FILTER_DEFAULTS);
    onSearch?.('');
  };

  return (
    <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>

        {/* 1. Search */}
        <FilterField label="Search" width={220}>
          <SearchBar onSearch={onSearch || (() => {})} />
        </FilterField>

        {/* 2. Type */}
        <FilterField label="Type" width={140}>
          <select
            value={filters.type}
            onChange={e => onChange({ ...filters, type: e.target.value, category_id: '' })}
            className="input"
            style={{ width: 140, cursor: 'pointer' }}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </FilterField>

        {/* 3. Category */}
        <FilterField label="Category" width={160}>
          <select
            value={filters.category_id}
            onChange={e => handle('category_id', e.target.value)}
            className="input"
            style={{ width: 160, cursor: 'pointer' }}
          >
            <option value="">All Categories</option>
            {filteredCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterField>

        {/* 4. Date From */}
        <FilterField label="From" width={140}>
          <input
            type="date" value={filters.startDate}
            onChange={e => handle('startDate', e.target.value)}
            max={filters.endDate || undefined}
            className="input" style={{ width: 140 }}
          />
        </FilterField>

        {/* 5. Date To */}
        <FilterField label="To" width={140}>
          <input
            type="date" value={filters.endDate}
            onChange={e => handle('endDate', e.target.value)}
            min={filters.startDate || undefined}
            className="input" style={{ width: 140 }}
          />
        </FilterField>

        {/* 6. Payment Source */}
        <FilterField label="Payment" width={150}>
          <select
            value={filters.payment_source}
            onChange={e => handle('payment_source', e.target.value)}
            className="input"
            style={{ width: 150, cursor: 'pointer' }}
          >
            <option value="">All Sources</option>
            <option value="online">Online</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
          </select>
        </FilterField>

        {/* 7. Sort */}
        <FilterField label="Sort" width={150}>
          <select
            value={`${filters.sortBy}_${filters.order}`}
            onChange={e => {
              const [sortBy, order] = e.target.value.split('_');
              onChange({ ...filters, sortBy, order });
            }}
            className="input"
            style={{ width: 150, cursor: 'pointer' }}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_asc">Amount ↑</option>
            <option value="amount_desc">Amount ↓</option>
          </select>
        </FilterField>

        {/* 8. Export Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <ExportButtons filters={exportFilters || filters} />
        </div>

        {/* Clear Filters */}
        {isActive && (
          <button
            onClick={clearAll}
            style={{
              alignSelf: 'flex-end',
              fontFamily: '"DM Sans", sans-serif', fontWeight: 400,
              fontSize: '0.8125rem', color: '#9CA3AF',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
          >
            Clear Filters ✕
          </button>
        )}
      </div>
    </div>
  );
}
