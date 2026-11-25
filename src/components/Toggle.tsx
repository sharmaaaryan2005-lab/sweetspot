import React from 'react';

export interface ToggleOption<T extends string> {
  id: T;
  label: string;
}

interface ToggleProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
}

export function Toggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'sm',
}: ToggleProps<T>) {
  const colsClass = options.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`grid ${colsClass} gap-1.5 p-1 rounded-xl bg-[#EAE6DC] dark:bg-[#20312D]`}
    >
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`${
              size === 'md' ? 'h-10 text-[13px]' : 'h-9 text-[12px]'
            } px-2 rounded-lg font-display font-bold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C] ${
              active
                ? 'bg-[#0E6B5C] text-white shadow-sm'
                : 'text-[#445C54] dark:text-[#B3C5BE] hover:text-[#162420] dark:hover:text-white'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
