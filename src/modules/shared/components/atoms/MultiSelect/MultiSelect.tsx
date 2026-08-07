import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { SelectOption } from 'modules/shared/types/common.types';
import './MultiSelect.scss';

interface MultiSelectProps {
  label?: string;
  options: SelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelect = ({ label, options, value, onChange, placeholder = 'Seleccionar...' }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeTag = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  const getLabel = (val: string) => options.find((o) => o.value === val)?.label || val;

  return (
    <div className="multi-select" ref={containerRef}>
      {label && <label className="multi-select__label">{label}</label>}
      <div className="multi-select__control" onClick={() => setIsOpen(!isOpen)}>
        <div className="multi-select__values">
          {value.length === 0 && <span className="multi-select__placeholder">{placeholder}</span>}
          {value.length > 0 && value.length <= 2 && value.map((v) => (
            <span key={v} className="multi-select__tag">
              {getLabel(v).length > 15 ? getLabel(v).substring(0, 15) + '...' : getLabel(v)}
              <button className="multi-select__tag-remove" onClick={(e) => removeTag(v, e)} aria-label="Quitar">
                <X size={12} />
              </button>
            </span>
          ))}
          {value.length > 2 && (
            <span className="multi-select__tag">
              {value.length} seleccionados
            </span>
          )}
        </div>
        <ChevronDown size={16} className={`multi-select__chevron ${isOpen ? 'multi-select__chevron--open' : ''}`} />
      </div>

      {isOpen && (
        <div className="multi-select__dropdown">
          <input
            type="text"
            className="multi-select__search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="multi-select__options">
            {filteredOptions.length === 0 && (
              <div className="multi-select__no-results">Sin resultados</div>
            )}
            {filteredOptions.map((opt) => (
              <label key={opt.value} className="multi-select__option">
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  onChange={() => toggleOption(opt.value)}
                  className="multi-select__checkbox"
                />
                <span className="multi-select__option-label">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
