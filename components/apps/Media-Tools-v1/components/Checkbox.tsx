
import React from 'react';
import { CheckIcon } from './icons';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
    const checkboxId = id || React.useId();
    return (
        <label htmlFor={checkboxId} className="flex items-center gap-3 cursor-pointer group">
            <input id={checkboxId} type="checkbox" className="sr-only peer" {...props} />
            <div className="w-5 h-5 flex-shrink-0 rounded border-2 border-light-border dark:border-zinc-600 group-hover:border-neutral-400 dark:group-hover:border-zinc-500 peer-checked:bg-accent-blue peer-checked:border-accent-blue flex items-center justify-center transition-colors">
                <CheckIcon className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <div>{label}</div>
        </label>
    );
};

export default Checkbox;