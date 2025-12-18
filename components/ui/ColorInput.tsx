
import React from 'react';
import { cn } from '../../utils/shared';

export interface ColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, containerClassName, label, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="color"
          className={cn(
            "p-1 h-11 w-full block bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff0e00]/50 focus:border-[#ff0e00] disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

ColorInput.displayName = 'ColorInput';
