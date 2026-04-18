export default function Button({ loading, variant = 'primary', children, className = '', ...props }) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    icon: 'btn-icon',
  }[variant] || 'btn-primary';

  return (
    <button
      disabled={loading || props.disabled}
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="spinner"
            style={{ width: 18, height: 18, borderWidth: 2.5, flexShrink: 0 }}
          />
          {typeof children === 'string' ? `${children}...` : children}
        </>
      ) : children}
    </button>
  );
}
