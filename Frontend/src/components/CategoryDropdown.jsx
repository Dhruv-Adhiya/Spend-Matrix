import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCategories } from '../services/categoryService';

const CAT_COLORS = ['#4F46E5','#10B981','#F59E0B','#EF4444','#8B5CF6','#3B82F6','#EC4899','#14B8A6'];

function getCatColor(cat, idx) {
  return cat?.color || CAT_COLORS[idx % CAT_COLORS.length];
}

export default function CategoryDropdown({ value, onChange, type, placeholder = 'Select category' }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch('');
  }, [open]);

  const filtered = (type ? categories.filter(c => c.type === type) : categories)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const selected = categories.find(c => String(c.id) === String(value));

  const handleSelect = (cat) => {
    onChange(String(cat.id));
    setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', minHeight: 42,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 14px',
          fontFamily: '"DM Sans", sans-serif', fontSize: '0.9375rem',
          background: '#FAFBFF', border: '1.5px solid #E5E7EB', borderRadius: 10,
          color: selected ? '#111827' : '#9CA3AF',
          cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s',
          outline: 'none',
          ...(open ? { borderColor: '#4F46E5', boxShadow: '0 0 0 3px rgba(79,70,229,0.15)' } : {}),
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {selected && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: getCatColor(selected, categories.indexOf(selected)), flexShrink: 0 }} />
          )}
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown size={16} color="#9CA3AF" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s ease', flexShrink: 0 }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1.5px solid rgba(79,70,229,0.15)',
          borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden', animation: 'fadeInUp 0.15s ease both',
          maxHeight: 260,
        }}>
          {/* Search */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', background: '#FAFBFF' }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search categories..."
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#111827',
              }}
            />
          </div>

          {/* Options */}
          <div style={{ overflowY: 'auto', maxHeight: 200, scrollbarWidth: 'thin', scrollbarColor: 'rgba(79,70,229,0.2) transparent' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>
                No categories found
              </div>
            ) : (
              filtered.map((cat, idx) => {
                const isSelected = String(cat.id) === String(value);
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(cat)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 14px', cursor: 'pointer',
                      background: isSelected ? 'rgba(79,70,229,0.08)' : 'transparent',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: getCatColor(cat, idx), flexShrink: 0 }} />
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem',
                      color: isSelected ? '#4F46E5' : '#111827',
                      fontWeight: isSelected ? 600 : 400,
                    }}>{cat.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
