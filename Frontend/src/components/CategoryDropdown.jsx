import { useEffect, useRef, useState } from 'react';
import { getCategories } from '../services/categoryService';
import CategoryModal from './CategoryModal';

export default function CategoryDropdown({ value, onChange, type }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const mounted = useRef(false);

  const fetchCategories = () => {
    setLoading(true);
    setError('');
    getCategories()
      .then(setCategories)
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset selection only after initial mount when type changes and value doesn't match
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (value) {
      const match = categories.find((c) => c.id === Number(value) && c.type === type);
      if (!match) onChange('');
    }
  }, [type]);

  const filtered = type ? categories.filter((c) => c.type === type) : categories;

  const handleCreated = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    onChange(newCategory.id);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        {error && <p className="text-xs text-red-500">{error}</p>}

        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === '__add__') {
              setShowModal(true);
              e.target.value = value; // reset select to previous value
            } else {
              onChange(e.target.value);
            }
          }}
          disabled={loading}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60"
        >
          <option value="">
            {loading ? 'Loading…' : filtered.length === 0 ? 'No categories' : 'Select category'}
          </option>

          {filtered.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}

          <option value="__add__">+ Add New Category</option>
        </select>
      </div>

      {showModal && (
        <CategoryModal
          defaultType={type}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
