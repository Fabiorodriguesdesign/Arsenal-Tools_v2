
import React from 'react';

interface ToolContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const ToolContainer: React.FC<ToolContainerProps> = ({ title, description, children }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-light-text dark:text-zinc-100 tracking-tight">{title}</h1>
        <p className="mt-2 text-base lg:text-lg text-light-muted dark:text-zinc-400 max-w-2xl mx-auto">{description}</p>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default ToolContainer;