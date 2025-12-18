
import React from 'react';
import { cn } from '../../utils/shared';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, label, error, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId} 
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 dark:focus:ring-accent-purple/20 focus:border-accent-blue dark:focus:border-accent-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-y",
            error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';