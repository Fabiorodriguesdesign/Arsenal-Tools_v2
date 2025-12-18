
import React from 'react';
import { cn } from '../../utils/shared';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, children, footer, noPadding = false, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
            "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md", 
            className
        )}
        {...props}
      >
        {(title || description) && (
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
                {title && <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">{title}</h3>}
                {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>}
            </div>
        )}
        
        <div className={cn(!noPadding && "p-6")}>
            {children}
        </div>

        {footer && (
            <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 rounded-b-xl">
                {footer}
            </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
