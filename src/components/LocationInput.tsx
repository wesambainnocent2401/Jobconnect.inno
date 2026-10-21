/**
 * Kenyan Location Autocomplete Input Component
 * Suggests Kenyan counties and major towns while typing
 */

import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { searchKenyanLocations } from '../lib/kenyaData';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = 'e.g. Westlands, Nairobi or Mombasa Island',
  required = false,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value && value.trim().length > 0) {
      const results = searchKenyanLocations(value);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: string) => {
    onChange(loc);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-[#d4af37] pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (value && value.trim().length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          required={required}
          className="input-gold w-full pl-9 pr-3 py-2.5 text-base"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-40 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-[#141318] border border-[#d4af37]/40 rounded-xl shadow-2xl py-1 text-sm divide-y divide-neutral-800">
          {suggestions.map((loc, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(loc)}
              className="px-4 py-2.5 hover:bg-[#d4af37]/15 cursor-pointer flex items-center gap-2 text-[#f3eee0] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#f5d77a] shrink-0" />
              <span>{loc}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
