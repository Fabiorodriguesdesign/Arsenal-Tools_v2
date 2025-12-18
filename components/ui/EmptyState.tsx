import React from 'react';
import { Button } from './Button';
import { cn } from '../../utils/shared';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm", className)}>
      <div className="p-4 rounded-full bg-white dark:bg-neutral-800 text-neutral-400 mb-4 shadow-sm">
        {React.isValidElement(icon) 
          ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-12 h-12' })
          : icon
        }
      </div>
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};