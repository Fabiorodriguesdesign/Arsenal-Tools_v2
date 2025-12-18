
import React from 'react';
import Checkbox from '../Checkbox';
import { MinusIcon, PlusIcon, LinkIcon, UnlinkIcon } from '../icons';

interface OptimizerSettingsPanelProps {
    quality: number;
    setQuality: (q: number) => void;
    maxWidth: number;
    setMaxWidth: (w: number) => void;
    maxHeight: number;
    setMaxHeight: (h: number) => void;
    isDimensionsLinked: boolean;
    setIsDimensionsLinked: (linked: boolean) => void;
    isResizingEnabled: boolean;
    setIsResizingEnabled: (enabled: boolean) => void;
    handleDimensionChange: (dimension: 'width' | 'height') => (e: React.ChangeEvent<HTMLInputElement>) => void;
    adjustQuality: (amount: number) => void;
    t: (key: string, replacements?: any) => string;
}

const OptimizerSettingsPanel: React.FC<OptimizerSettingsPanelProps> = ({
    quality, setQuality, maxWidth, maxHeight, isDimensionsLinked, setIsDimensionsLinked,
    isResizingEnabled, setIsResizingEnabled, handleDimensionChange, adjustQuality, t
}) => {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between mb-2">
                     <label htmlFor="quality" className="block text-sm font-medium text-zinc-300">{t('jpegQuality', { quality: quality })}</label>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => adjustQuality(-10)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                        aria-label="Diminuir qualidade"
                    >
                        <MinusIcon className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="range" 
                            id="quality" 
                            min="1" 
                            max="100" 
                            value={quality} 
                            onChange={e => setQuality(Number(e.target.value))} 
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer range-lg accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" 
                        />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-[#ff0e00] font-bold">{quality}%</span>
                    </div>
                    <button 
                        onClick={() => adjustQuality(10)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                        aria-label="Aumentar qualidade"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

             <div className="pt-4 border-t border-zinc-800">
                <Checkbox
                    id="resize-images"
                    checked={isResizingEnabled}
                    onChange={() => setIsResizingEnabled(!isResizingEnabled)}
                    label={<div className="text-sm">
                            <span className="font-medium text-zinc-200">{t('resizeImages')}</span>
                            <p className="text-zinc-400 text-xs">{t('uncheckToCompressOnly')}</p>
                        </div>}
                />
            </div>
            {isResizingEnabled && (
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 animate-fade-in">
                    <div className="grid grid-cols-5 gap-2 items-end">
                        <div className="col-span-2">
                            <label htmlFor="maxWidth" className="block text-sm font-medium text-zinc-300 mb-1">{t('maxWidth')}</label>
                            <input type="number" id="maxWidth" value={maxWidth} onChange={handleDimensionChange('width')} className="w-full p-2 border border-zinc-700 rounded-md shadow-sm focus:ring-[#ff0e00] focus:border-[#ff0e00] bg-zinc-950 text-zinc-100" min="1" />
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <button
                                onClick={() => setIsDimensionsLinked(!isDimensionsLinked)}
                                className={`p-2 rounded-full hover:bg-zinc-800 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ff0e00] transition-all ${isDimensionsLinked ? 'ring-2 ring-[#ff0e00] bg-red-900/20' : ''}`}
                            >
                                {isDimensionsLinked ? <LinkIcon className="w-5 h-5 text-[#ff0e00]" /> : <UnlinkIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="maxHeight" className="block text-sm font-medium text-zinc-300 mb-1">{t('maxHeight')}</label>
                            <input type="number" id="maxHeight" value={maxHeight} onChange={handleDimensionChange('height')} className="w-full p-2 border border-zinc-700 rounded-md shadow-sm focus:ring-[#ff0e00] focus:border-[#ff0e00] bg-zinc-950 text-zinc-100" min="1" />
                        </div>
                    </div>
                     <p className="text-[10px] text-zinc-500 text-center mt-2">{t('dimensionLimit', { limit: 8000 })}</p>
                </div>
            )}
        </div>
    );
};

export default OptimizerSettingsPanel;