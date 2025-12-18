
import React, { useState } from 'react';
import { AspectRatio, OutputFormat, ASPECT_RATIOS } from '../types';
import { LinkIcon, UnlinkIcon, MinusIcon, PlusIcon, ChevronDownIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import Checkbox from './Checkbox';

interface SettingsPanelProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
  isDimensionsLinked: boolean;
  setIsDimensionsLinked: (isLinked: boolean) => void;
  padding: number;
  setPadding: (padding: number) => void;
  trim?: boolean;
  setTrim?: (trim: boolean) => void;
  isSingleImageMode?: boolean;
}

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex justify-between items-center bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
            >
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-wide">{title}</span>
                <ChevronDownIcon className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  aspectRatio,
  setAspectRatio,
  width,
  setWidth,
  height,
  setHeight,
  outputFormat,
  setOutputFormat,
  isDimensionsLinked,
  setIsDimensionsLinked,
  padding,
  setPadding,
  trim,
  setTrim,
  isSingleImageMode = false,
}) => {
  const baseInputStyles = "w-full p-2 border border-zinc-700 rounded-md shadow-sm focus:ring-[#ff0e00] focus:border-[#ff0e00] bg-zinc-950 text-zinc-100";
  const { t } = useLanguage();

  const handleAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRatio = e.target.value as AspectRatio;
    setAspectRatio(selectedRatio);
    const ratioData = ASPECT_RATIOS.find(r => r.label === selectedRatio);
    if (ratioData && !ratioData.custom) {
      setWidth(ratioData.width);
      setHeight(ratioData.height);
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value < 1) return;

    if (isDimensionsLinked && width > 0 && height > 0) {
        const currentRatio = width / height;
        if (dimension === 'width') {
            const newHeight = value > 0 && currentRatio > 0 ? Math.round(value / currentRatio) : height;
            setWidth(value);
            setHeight(newHeight);
        } else {
            const newWidth = value > 0 && currentRatio > 0 ? Math.round(value * currentRatio) : width;
            setHeight(value);
            setWidth(newWidth);
        }
    } else {
        if (dimension === 'width') {
            setWidth(value);
        } else {
            setHeight(value);
        }
    }
    setAspectRatio('Custom');
  };

  const handlePaddingChange = (newValue: number) => {
      const clamped = Math.max(0, Math.min(500, newValue));
      setPadding(clamped);
  };

  return (
    <div className="space-y-3">
        {/* Layout Settings Accordion */}
        <AccordionItem title="Layout e Ajustes" defaultOpen={true}>
            <div className="space-y-4">
                {setTrim && trim !== undefined && (
                    <div>
                        <Checkbox 
                            checked={trim} 
                            onChange={(e) => setTrim(e.target.checked)}
                            label={
                                <div>
                                    <span className="text-zinc-200 font-medium">{t('trim')}</span>
                                    <p className="text-xs text-zinc-500">{t('trimDesc')}</p>
                                </div>
                            }
                        />
                    </div>
                )}

                <div>
                    <div className="flex justify-between mb-2">
                        <label htmlFor="padding" className="block text-sm font-medium text-zinc-300">Margem (Padding)</label>
                        <span className="text-sm font-mono text-[#ff0e00] font-bold">{padding}px</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handlePaddingChange(padding - 50)} 
                            className="p-2 bg-zinc-800 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            aria-label="Diminuir padding"
                        >
                            <MinusIcon className="w-4 h-4"/>
                        </button>
                        
                        <div className="flex-grow flex flex-col gap-2">
                            <input 
                                type="range" 
                                id="padding" 
                                min="0" 
                                max="500" 
                                step="50" 
                                value={padding} 
                                onChange={e => handlePaddingChange(Number(e.target.value))} 
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer range-lg accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" 
                                aria-label={t('paddingSlider')} 
                            />
                        </div>
                        
                        <button 
                            onClick={() => handlePaddingChange(padding + 50)} 
                            className="p-2 bg-zinc-800 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            aria-label="Aumentar padding"
                        >
                            <PlusIcon className="w-4 h-4"/>
                        </button>
                    </div>

                    {padding > 0 && (
                        <p className="text-[10px] text-[#ff0e00] mt-2 font-medium bg-[#ff0e00]/10 p-1.5 rounded border border-[#ff0e00]/20">
                            Atenção: A área vermelha no preview é apenas um guia visual da margem.
                        </p>
                    )}
                </div>
            </div>
        </AccordionItem>

        {/* Dimensions Accordion */}
        <AccordionItem title="Dimensões de Saída">
             {/* Aspect Ratio */}
            <div className="mb-3">
                <select
                id="aspect-ratio"
                value={aspectRatio}
                onChange={handleAspectRatioChange}
                className={baseInputStyles}
                >
                {ASPECT_RATIOS.map(ratio => (
                    <option key={ratio.label} value={ratio.label}>{ratio.label}</option>
                ))}
                </select>
            </div>

            {/* Custom Dimensions */}
            <div className="grid grid-cols-5 gap-2 items-end">
                <div className="col-span-2">
                <label htmlFor="width" className="block text-xs text-zinc-500 mb-1">{t('widthPx')}</label>
                <input
                    type="number"
                    id="width"
                    value={width}
                    onChange={handleDimensionChange('width')}
                    className={baseInputStyles}
                    min="1"
                />
                </div>
                <div className="col-span-1 flex justify-center">
                <button
                    onClick={() => setIsDimensionsLinked(!isDimensionsLinked)}
                    className={`p-2 rounded-full hover:bg-zinc-800 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ff0e00] transition-all ${isDimensionsLinked ? 'bg-[#ff0e00]/10 text-[#ff0e00]' : ''}`}
                    aria-label={isDimensionsLinked ? t('dimensionsSynchronized') : t('dimensionsIndependent')}
                >
                    {isDimensionsLinked ? <LinkIcon className="w-5 h-5" /> : <UnlinkIcon className="w-5 h-5" />}
                </button>
                </div>
                <div className="col-span-2">
                <label htmlFor="height" className="block text-xs text-zinc-500 mb-1">{t('heightPx')}</label>
                <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={handleDimensionChange('height')}
                    className={baseInputStyles}
                    min="1"
                />
                </div>
            </div>
        </AccordionItem>

        {/* Format Accordion */}
        <AccordionItem title="Formato do Arquivo">
             <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                    <input
                    type="radio"
                    name="output-format"
                    value="png"
                    checked={outputFormat === 'png'}
                    onChange={() => setOutputFormat('png')}
                    className="h-4 w-4 text-[#ff0e00] border-zinc-600 focus:ring-[#ff0e00] bg-zinc-800"
                    aria-label={t('outputFormatPng')}
                    />
                    <span className="ml-2 text-sm text-zinc-200">PNG</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input
                    type="radio"
                    name="output-format"
                    value="jpeg"
                    checked={outputFormat === 'jpeg'}
                    onChange={() => setOutputFormat('jpeg')}
                    className="h-4 w-4 text-[#ff0e00] border-zinc-600 focus:ring-[#ff0e00] bg-zinc-800"
                    aria-label={t('outputFormatJpg')}
                    />
                    <span className="ml-2 text-sm text-zinc-200">JPG</span>
                </label>
                <label className={`flex items-center ${isSingleImageMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <input
                    type="radio"
                    name="output-format"
                    value="zip"
                    checked={outputFormat === 'zip'}
                    onChange={() => setOutputFormat('zip')}
                    disabled={isSingleImageMode}
                    className="h-4 w-4 text-[#ff0e00] border-zinc-600 focus:ring-[#ff0e00] bg-zinc-800 disabled:bg-zinc-900 disabled:border-zinc-700 disabled:cursor-not-allowed"
                    aria-label={t('outputFormatZip')}
                    />
                    <span className={`ml-2 text-sm ${isSingleImageMode ? 'text-zinc-500' : 'text-zinc-200'}`}>ZIP</span>
                </label>
                </div>
                {outputFormat === 'zip' && !isSingleImageMode && (
                    <p className="text-xs text-zinc-400 mt-1">
                        {t('zipContainsProcessedAndOriginal')}
                    </p>
                )}
            </div>
        </AccordionItem>
    </div>
  );
};

export default SettingsPanel;
