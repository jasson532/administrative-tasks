import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import type { SelectOption } from 'modules/shared/types/common.types';
import './SearchSelect.scss';

interface SearchSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const SearchSelect = ({ label, options, value, onChange, placeholder = 'Buscar...', error }: SearchSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((o) => o.value === value)?.label || '';

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className={`search-select ${error ? 'search-select--error' : ''}`} ref={containerRef}>
      {label && <label className="search-select__label">{label}</label>}
      <div className="search-select__control" onClick={handleOpen}>
        {value ? (
          <span className="search-select__value">{selectedLabel}</span>
        ) : (
          <span className="search-select__placeholder">{placeholder}</span>
        )}
        <div className="search-select__icons">
          {value && (
            <button className="search-select__clear" onClick={handleClear} aria-label="Limpiar">
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`search-select__chevron ${isOpen ? 'search-select__chevron--open' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="search-select__dropdown">
          <div className="search-select__search-wrapper">
            <Search size={14} className="search-select__search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-select__search"
              placeholder="Escriba para buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="search-select__options">
            {filteredOptions.length === 0 && (
              <div className="search-select__no-results">Sin resultados</div>
            )}
            {filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className={`search-select__option ${opt.value === value ? 'search-select__option--selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <span className="search-select__error">{error}</span>}
    </div>
  );
};

export default SearchSelect;
