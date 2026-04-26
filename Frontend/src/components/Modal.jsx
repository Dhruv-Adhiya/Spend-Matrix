import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '520px', showClose = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    // Focus first focusable element
    const el = containerRef.current?.querySelector('input, button, textarea, select, [tabindex]');
    el?.focus();
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="modal-overlay"
    >
      <div
        ref={containerRef}
        onClick={e => e.stopPropagation()}
        className="modal-box"
        style={{ maxWidth }}
      >
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px 0', marginBottom: 20,
          }}>
            <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)' }}>
              {title}
            </h2>
            {showClose && (
              <button
                onClick={onClose}
                className="btn-icon"
                aria-label="Close"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(79,70,229,0.06)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6B7280', transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; e.currentTarget.style.color = '#6B7280'; }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
