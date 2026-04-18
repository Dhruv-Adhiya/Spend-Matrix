import { useState } from 'react';

export default function Input({ label, error, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input${error ? ' error' : ''}`}
        style={{
          borderColor: focused && !error ? '#4F46E5' : undefined,
          boxShadow: focused && !error
            ? '0 0 0 3px rgba(79,70,229,0.15)'
            : focused && error
            ? '0 0 0 3px rgba(239,68,68,0.12)'
            : undefined,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
