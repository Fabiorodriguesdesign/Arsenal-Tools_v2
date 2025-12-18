

import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  const { t } = useTranslation();
  return (
    <div className={`bg-light-card dark:bg-dark-card rounded-xl shadow-lg p-6 border border-light-border dark:border-dark-border transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">{t(title)}</h2>}
      {children}
    </div>
  );
};

export default Card;