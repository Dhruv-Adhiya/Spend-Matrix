import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from './Icon';
import './GlassInput.css';

export const GlassSelect = React.forwardRef(({
  label,
  error,
  icon,
  className = '',
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    setIsOpen(false);
    if (onChange && !disabled) {
      // Mock the event object so existing handlers work seamlessly
      onChange({
        target: {
          name,
          value: optionValue
        }
      });
    }
  };

  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div 
      className={`glass-input-wrapper ${className} ${isOpen ? 'is-open' : ''}`} 
      ref={wrapperRef}
    >
      {label && (
        <label htmlFor={selectId} className="glass-input-label">
          {label}
        </label>
      )}
      <div className="glass-input-container">
        {icon && (
          <span className="glass-input-icon">
            <Icon name={icon} size={18} />
          </span>
        )}
        
        {/* The fake "select" button */}
        <div
          ref={ref}
          id={selectId}
          className={`glass-input glass-select-button ${icon ? 'with-icon' : ''} ${error ? 'has-error' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          {...props}
        >
          <span className={`glass-select-value ${!selectedOption ? 'placeholder' : ''}`}>
            {displayValue}
          </span>
        </div>

        <span className="glass-select-chevron">
          <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} />
        </span>

        {/* The custom dropdown menu */}
        {isOpen && !disabled && (
          <div className="glass-select-menu" role="listbox">
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`glass-select-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                  {isSelected && (
                    <Icon name="Check" size={14} style={{ marginLeft: 'auto' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {error && (
        <span id={`${selectId}-error`} className="glass-input-error">
          {error}
        </span>
      )}
    </div>
  );
});

GlassSelect.displayName = 'GlassSelect';

GlassSelect.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};
