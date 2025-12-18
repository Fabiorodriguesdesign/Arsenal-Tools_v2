
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface NoResultsProps {
    searchTerm: string;
}

const NoResults: React.FC<NoResultsProps> = ({ searchTerm }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg mx-4 sm:mx-0 flex flex-col items-center gap-4 border border-neutral-200 dark:border-neutral-800 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-neutral-400 dark:text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM15 9.75L9 15.75m0-6l6 6" />
            </svg>
            <div>
                <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">{t('noResultsTitle')}</p>
                <p className="text-neutral-500 max-w-md mx-auto mt-1">{t('noResultsSubtitle').replace('{searchTerm}', searchTerm)}</p>
            </div>
        </div>
    );
};

export default NoResults;
