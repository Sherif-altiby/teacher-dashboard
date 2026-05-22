"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "اختر...",
  icon: Icon,
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full relative pr-11 pl-10 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-right text-sm font-medium text-slate-600 cursor-pointer transition-all duration-200 outline-none
          ${isOpen ? "border-accent bg-white shadow-sm ring-2 ring-accent/10 text-slate-900" : "hover:bg-slate-100/60"}
          ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
      >
        {/* Leading Icon */}
        {Icon && (
          <Icon
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              isOpen ? "text-accent" : "text-slate-400"
            }`}
            size={18}
          />
        )}

        {/* Selected Label */}
        <span className="block truncate">{displayLabel}</span>

        {/* Chevron Icon */}
        <ChevronDown
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-300 pointer-events-none ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
          size={16}
        />
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-premium py-2 max-h-60 overflow-y-auto custom-scrollbar animate-dropdown">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-right px-4 py-3 text-sm font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-accent-soft/30 text-accent font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check size={16} className="text-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
