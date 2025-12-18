import React from 'react';
import { Icon } from '../icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Icon name="chevron-left" className="w-4 h-4" />
        Anterior
      </button>
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Próximo
        <Icon name="chevron-right" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;