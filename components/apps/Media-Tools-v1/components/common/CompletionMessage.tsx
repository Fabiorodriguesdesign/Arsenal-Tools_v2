
import React, { useEffect, useRef } from 'react';
import { CheckCircleIcon, TrashIcon } from '../icons';

interface CompletionMessageProps {
    onClear: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({ onClear, t }) => {
    const newBatchButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        newBatchButtonRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center py-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-xl font-semibold text-light-text dark:text-zinc-100 mb-4">{t('processingComplete')}</p>
            <button
                ref={newBatchButtonRef}
                onClick={onClear}
                className="w-full flex items-center justify-center gap-2 bg-gradient-accent text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-offset-zinc-900"
                aria-label={t('startNewBatch')}
            >
                <TrashIcon className="w-5 h-5" />
                {t('startNewBatch')}
            </button>
        </div>
    );
};

export default CompletionMessage;