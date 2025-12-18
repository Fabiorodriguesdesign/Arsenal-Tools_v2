
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProgressDisplayProps {
    progress: number;
    processedCount: number;
    totalFiles: number;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress, processedCount, totalFiles, t }) => {
    return (
        <div className="w-full bg-zinc-800 rounded-full h-4 mb-4 relative overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-live="polite">
            <div className="bg-[#ff0e00] h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white mix-blend-normal">
                {t('processing')} {totalFiles > 1 ? `(${processedCount}/${totalFiles})` : ''} {progress}%
            </span>
        </div>
    );
};

export default ProgressDisplay;
