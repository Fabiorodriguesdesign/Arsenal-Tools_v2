
import React from 'react';
import { CheckCircleIcon } from '../icons';

type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'tiff';

interface ConverterSettingsPanelProps {
    outputFormat: OutputFormat;
    setOutputFormat: (format: OutputFormat) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    keepTransparency: boolean;
    setKeepTransparency: (keep: boolean) => void;
    t: (key: string) => string;
}

const ConverterSettingsPanel: React.FC<ConverterSettingsPanelProps> = ({
    outputFormat, setOutputFormat, backgroundColor, setBackgroundColor, keepTransparency, setKeepTransparency, t
}) => {
    const formats: OutputFormat[] = ['png', 'jpeg', 'webp', 'avif', 'tiff'];
    const supportsTransparency = ['png', 'webp', 'avif', 'tiff'].includes(outputFormat);

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">{t('convertToFormat')}:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {formats.map(format => (
                        <button
                            key={format}
                            onClick={() => setOutputFormat(format)}
                            className={`
                                relative p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2
                                ${outputFormat === format 
                                    ? 'border-[#ff0e00] bg-[#ff0e00]/10 text-white' 
                                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'}
                            `}
                        >
                            <span className="uppercase font-bold text-sm">{format}</span>
                            {outputFormat === format && (
                                <div className="absolute top-1 right-1">
                                    <CheckCircleIcon className="w-4 h-4 text-[#ff0e00]" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {supportsTransparency && (
                <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 mt-4">
                     <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="keep-transparency" className="font-medium text-zinc-200 cursor-pointer block">{t('keepTransparency')}</label>
                            <p className="text-xs text-zinc-400 mt-1">{t('generatesTransparentBackground')}</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                            <input
                                id="keep-transparency"
                                type="checkbox"
                                className="sr-only peer"
                                checked={keepTransparency}
                                onChange={() => setKeepTransparency(!keepTransparency)}
                            />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff0e00]"></div>
                        </div>
                    </div>
                </div>
            )}
            
            {(!supportsTransparency || !keepTransparency) && (
                <div className="mt-4 pt-4 border-t border-zinc-800 animate-fade-in">
                    <label htmlFor="bg-color" className="block text-sm font-medium text-zinc-300 mb-2">
                        {t('backgroundColorForTransparency')}
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-700 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                            <input
                                type="color"
                                id="bg-color-picker"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 cursor-pointer border-none"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                id="bg-color-hex"
                                value={backgroundColor}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                                        setBackgroundColor(value);
                                    }
                                }}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-zinc-100 font-mono focus:ring-[#ff0e00] focus:border-[#ff0e00] uppercase"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                        {t('transparencyConversionNote')}
                    </p>
                </div>
            )}
        </div>
    );
}

export default ConverterSettingsPanel;
