

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ClipboardIcon, ClipboardCheckIcon } from '../icons';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { hexToRgb, rgbToCmyk, simulatePantone } from '../../services/colorService';

interface ColorCardProps {
    hex: string;
    onColorChange: (newColor: string) => void;
}

const ColorCard: React.FC<ColorCardProps> = React.memo(({ hex, onColorChange }) => {
    const [copiedHex, setCopiedHex] = useState(false);
    const [inputValue, setInputValue] = useState(hex);
    const { t } = useLanguage();
    const { addToast } = useToast();

    // Sync input value if prop changes externally (e.g. re-generation)
    useEffect(() => {
        setInputValue(hex);
    }, [hex]);

    const rgb = useMemo(() => hexToRgb(hex), [hex]);
    const cmyk = useMemo(() => rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null, [rgb]);
    const pantone = useMemo(() => simulatePantone(hex), [hex]);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
             addToast(`${t('copied')}! ${text}`, 'success');
        }, (err) => {
            console.error('Could not copy text: ', err);
            addToast('Failed to copy', 'error');
        });
    }, [addToast, t]);

    const handleCopy = useCallback((textToCopy: string) => {
        copyToClipboard(textToCopy);
        setCopiedHex(true);
        setTimeout(() => setCopiedHex(false), 2000);
    }, [copyToClipboard]);

    const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, []);

    const handleHexInputBlur = useCallback(() => {
        const cleanHex = inputValue.trim().toUpperCase();
        if (/^#[0-9A-F]{6}$/i.test(cleanHex)) {
            if (cleanHex !== hex) {
                onColorChange(cleanHex);
            }
        } else {
            // Revert invalid input
            setInputValue(hex);
        }
    }, [inputValue, hex, onColorChange]);
    
    const handleHexInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleHexInputBlur();
            e.currentTarget.blur();
        }
    }, [handleHexInputBlur]);

    return (
        <div className="flex flex-col gap-3 bg-zinc-800/50 p-3 rounded-lg border border-transparent hover:border-zinc-700 transition-colors">
            {/* Color Swatch & Picker */}
            <div className="relative group">
                 <label 
                    className="block w-full aspect-video rounded-md shadow-lg cursor-pointer transition-transform transform group-hover:scale-[1.02] ring-2 ring-transparent hover:ring-zinc-600 overflow-hidden relative"
                    style={{ backgroundColor: hex }}
                    title={t('clickToEditColor')}
                >
                    <input 
                        type="color" 
                        value={hex} 
                        onChange={(e) => onColorChange(e.target.value.toUpperCase())}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                        </svg>
                    </div>
                </label>
            </div>

            <div className="space-y-2 text-xs font-mono">
                {/* Editable HEX */}
                <div className="flex justify-between items-center group">
                    <span className="text-zinc-400 select-none">HEX</span>
                    <div className="flex items-center gap-1.5 flex-grow justify-end max-w-[70%]">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={handleHexInputChange}
                            onBlur={handleHexInputBlur}
                            onKeyDown={handleHexInputKeyDown}
                            className="bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-[#ff0e00] focus:outline-none text-zinc-100 text-right w-full px-1 py-0.5"
                            aria-label={t('editHex')}
                        />
                        <button onClick={() => handleCopy(hex)} aria-label={t('copyColorCode', { color: hex })} className="focus:outline-none">
                            {copiedHex ? <ClipboardCheckIcon className="w-4 h-4 text-green-400 flex-shrink-0"/> : <ClipboardIcon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors flex-shrink-0"/>}
                        </button>
                    </div>
                </div>
                {/* Calculated RGB */}
                {rgb && (
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 select-none">{t('rgbCode')}</span>
                        <span className="text-zinc-100">{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</span>
                    </div>
                )}
                {/* Calculated CMYK */}
                {cmyk && (
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-400 select-none">{t('cmykCode')}</span>
                        <span className="text-zinc-100">{`${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}`}</span>
                    </div>
                )}
                {/* Calculated Pantone */}
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400 select-none">{t('pantoneCode')}</span>
                    <span className="text-zinc-100 truncate">{pantone}</span>
                </div>
            </div>
        </div>
    );
});

export default ColorCard;