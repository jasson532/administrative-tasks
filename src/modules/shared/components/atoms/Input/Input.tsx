import { forwardRef, type InputHTMLAttributes } from 'react';
import './Input.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

    return (
      <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-field__label">
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className="input-field__input" {...props} />
        {error && <span className="input-field__error">{error}</span>}
        {helperText && !error && <span className="input-field__helper">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
