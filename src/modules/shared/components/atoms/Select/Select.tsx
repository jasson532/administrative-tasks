import { forwardRef, type SelectHTMLAttributes } from 'react';
import type { SelectOption } from 'modules/shared/types/common.types';
import './Select.scss';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder = 'Seleccionar...', id, className = '', ...props }, ref) => {
    const selectId = id || `select-${label?.toLowerCase().replace(/\s/g, '-')}`;

    return (
      <div className={`select-field ${error ? 'select-field--error' : ''} ${className}`}>
        {label && (
          <label htmlFor={selectId} className="select-field__label">
            {label}
          </label>
        )}
        <select ref={ref} id={selectId} className="select-field__select" {...props}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="select-field__error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
