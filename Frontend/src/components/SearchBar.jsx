import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(value.trim()), 350);
    return () => clearTimeout(timer.current);
  }, [value]);

  return (
    <div style={{ position: 'relative', width: 220, flexShrink: 0 }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: '#9CA3AF', pointerEvents: 'none', display: 'flex',
      }}>
        <Search size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search transactions..."
        className="input"
        style={{ paddingLeft: 38, paddingRight: value ? 32 : undefined }}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9CA3AF', fontSize: 14, lineHeight: 1,
          }}
        >✕</button>
      )}
    </div>
  );
}
