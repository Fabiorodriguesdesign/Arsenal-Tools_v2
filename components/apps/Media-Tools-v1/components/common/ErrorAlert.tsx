
import React from 'react';
import { AlertTriangleIcon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface ErrorAlertProps {
    failedFiles: string[];
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ failedFiles, t }) => {
    if (failedFiles.length === 0) return null;

    return (
        <div className="bg-amber-950/50 border-l-4 border-amber-500 p-4 rounded-r-md mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-300">
                        {t('someFilesFailed')}
                    </h3>
                    <div className="mt-2 text-sm text-amber-400">
                        <p>{t('filesIgnored')}:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 max-h-24 overflow-y-auto">
                            {failedFiles.map(name => <li key={name} className="font-mono text-xs break-all">{name}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorAlert;
