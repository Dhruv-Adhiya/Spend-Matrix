export default function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <label
      style={{
        display: 'inline-flex', alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
      }}
    >
      {/* Hidden accessible checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={e => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />

      {/* Track */}
      <div
        style={{
          width: 48, height: 26, borderRadius: 999,
          position: 'relative',
          background: checked
            ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
            : '#D1D5DB',
          transition: 'background-color 0.2s ease',
          opacity: disabled ? 0.5 : 1,
          boxShadow: 'none',
          outline: 'none',
        }}
      >
        {/* Thumb */}
        <div
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: '#fff',
            position: 'absolute', top: 3,
            left: checked ? 25 : 3,
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      </div>
    </label>
  );
}
