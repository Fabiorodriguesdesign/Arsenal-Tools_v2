
import React from 'react';
import { cn } from '../../utils/shared';
import { Icon } from '../icons';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  containerClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, containerClassName, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className={cn("flex items-center gap-2.5", containerClassName)}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition-colors duration-200 ease-in-out",
            "border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800",
            "peer-checked:bg-accent-blue peer-checked:border-accent-blue",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent-blue dark:peer-focus-visible:ring-offset-neutral-950",
            className
          )}
        >
          <Icon name="check" className="h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
        </label>
        {label && (
          <label htmlFor={checkboxId} className="cursor-pointer text-sm font-medium text-neutral-700 dark:text-neutral-300 select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';