import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isLoading?: boolean;
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', isLoading = false, size = 'md', ...props }) => {
  const baseClasses = 'rounded-md font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-light-border text-light-text hover:bg-zinc-300 dark:bg-dark-border dark:text-dark-text dark:hover:bg-zinc-600 focus:ring-zinc-400 active:bg-zinc-400 dark:active:bg-zinc-500',
    danger: 'bg-danger text-white hover:bg-red-600 focus:ring-danger transform hover:-translate-y-0.5 active:translate-y-0',
    success: 'bg-secondary text-white hover:bg-green-600 focus:ring-secondary transform hover:-translate-y-0.5 active:translate-y-0',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2',
  };

  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;