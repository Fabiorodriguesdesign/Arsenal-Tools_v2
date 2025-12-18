import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowLeftIcon, InstagramIcon } from '../shared/Icons';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="p-6">
            <div className="flex flex-col items-center gap-5">
                <a 
                    href="https://fabiorodriguesdesign.com.br/fabio-rodrigues-dsgn" 
                    className="inline-flex items-center justify-center gap-2 bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text font-semibold py-2 px-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg dark:hover:bg-dark-card transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-bg"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    {t('back.to.flow')}
                </a>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-sm text-light-muted dark:text-dark-muted">
                    <a href="https://fabiorodriguesdesign.com" target="_blank" rel="noopener noreferrer" className="font-medium text-light-text dark:text-dark-text hover:text-primary dark:hover:text-primary transition-colors">{t('author.credit')}</a>
                    <span className="hidden sm:inline text-light-border dark:text-dark-border">|</span>
                     <a href="https://www.instagram.com/fabiorodriguesdsgn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-medium text-light-text dark:text-dark-text hover:text-primary dark:hover:text-primary transition-colors">
                        <InstagramIcon className="w-4 h-4" />
                        {t('author.instagram')}
                     </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
