

import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface MobileStepContainerProps {
    stepNumber: number;
    totalSteps: number;
    title: string;
    children?: React.ReactNode; 
    onNext?: () => void;
    onPrev?: () => void;
    isNextDisabled?: boolean;
    showNavigation?: boolean; // New prop to control if navigation buttons are shown
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const MobileStepContainer: React.FC<MobileStepContainerProps> = ({
    stepNumber,
    totalSteps,
    title,
    children,
    onNext,
    onPrev,
    isNextDisabled = false,
    showNavigation = true, // Default to true
    t,
}) => {
    const panelClasses = "bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md";

    return (
        <div className={panelClasses}>
            <div className="mb-4">
                <span className="text-sm font-semibold text-[#ff0e00]">{t('stepXofY', { x: stepNumber, y: totalSteps })}</span>
                <h3 className="text-xl font-bold text-zinc-100">{title}</h3>
            </div>
            {children}
            {showNavigation && (
                <div className="mt-6 flex justify-between">
                    {onPrev && (
                        <button
                            onClick={onPrev}
                            className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                            aria-label={t('back')}
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            {t('back')}
                        </button>
                    )}
                    {onNext && (
                        <button
                            onClick={onNext}
                            disabled={isNextDisabled}
                            className="flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0e00]"
                            aria-label={t('nextStep')}
                        >
                            {t('nextStep')}
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MobileStepContainer;