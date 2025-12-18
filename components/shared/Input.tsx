
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, icon, error, className, ...props }, ref) => {
  const { t } = useTranslation();
  const errorClasses = 'border-danger focus:border-danger focus:ring-danger';
  const defaultClasses = 'border-light-border dark:border-dark-border focus:border-primary focus:ring-primary';
  const inputId = props.id || (props.name ? `input-${props.name}` : undefined);
  const errorId = error ? `${inputId}-error` : undefined;
  const translatedError = error ? t(error) : null;

  // Merge passed className with default styles instead of replacing them
  const combinedClasses = `w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-light-muted/70 dark:placeholder-dark-muted/70 transition duration-200 ease-in-out focus:ring-2 focus:ring-opacity-50 outline-none ${icon ? 'pl-10' : ''} ${error ? errorClasses : defaultClasses} ${className || ''}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t(label)}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-light-muted">{icon}</div>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={combinedClasses}
          {...props}
        />
      </div>
      {translatedError && (
        <p id={errorId} className="mt-1 text-xs text-danger animate-fadeIn" role="alert">
          {translatedError}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
