// OBSOLETE: To be deleted. This functionality has been moved into the Kit Freelancer app.

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
    const { language, toggleLanguage } = useLanguage();
    const { t } = useTranslation();
    return (
        <button
            onClick={toggleLanguage}
            className={`p-2 rounded-full text-light-muted hover:bg-light-border dark:hover:bg-dark-border dark:text-dark-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-semibold w-10 h-10 flex items-center justify-center ${className || ''}`}
            aria-label={t('header.toggle.language')}
        >
            {language.toUpperCase()}
        </button>
    );
};

export default LanguageToggle;