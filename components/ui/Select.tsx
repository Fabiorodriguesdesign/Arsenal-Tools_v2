
import React from 'react';
import { cn } from '../../utils/shared';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  options?: { label: string; value: string | number }[];
  leftIcon?: React.ReactNode;
}

const SelectComponent = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, label, error, options, children, id, leftIcon, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 z-10">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:focus:ring-accent-purple/20 focus:border-accent-blue dark:focus:border-accent-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none",
              leftIcon && "pl-10",
              error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
              className
            )}
            {...props}
          >
            {options 
                ? options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
                : children
            }
          </select>
          {/* Custom Chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

SelectComponent.displayName = 'Select';

export const Select = React.memo(SelectComponent);