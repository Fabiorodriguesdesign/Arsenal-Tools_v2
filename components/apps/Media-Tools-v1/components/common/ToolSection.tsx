
import React from 'react';

interface ToolSectionProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    className?: string;
    actions?: React.ReactNode;
}

const ToolSection: React.FC<ToolSectionProps> = ({ children, title, description, className = "", actions }) => {
    return (
        <div className={`bg-light-card dark:bg-zinc-900 border border-light-border dark:border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 ${className}`}>
            {(title || actions || description) && (
                <div className="flex justify-between items-start mb-4">
                    <div>
                        {title && <h3 className="text-lg font-bold text-light-text dark:text-zinc-100">{title}</h3>}
                        {description && <p className="text-sm text-light-muted dark:text-zinc-400 mt-1">{description}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default ToolSection;