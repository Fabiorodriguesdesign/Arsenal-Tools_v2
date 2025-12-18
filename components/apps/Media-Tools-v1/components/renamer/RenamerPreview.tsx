
import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowRightIcon as ArrowIcon } from '../icons';
import { ProcessedFileItem } from '../../hooks/useFileProcessor';

interface RenamerPreviewProps {
    processedItems: ProcessedFileItem[];
    previewIndex: number;
    baseName: string;
    isGroupingEnabled: boolean;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    onPrev: () => void;
    onNext: () => void;
}

const RenamerPreview: React.FC<RenamerPreviewProps> = ({
    processedItems,
    previewIndex,
    baseName,
    isGroupingEnabled,
    t,
    onPrev,
    onNext
}) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">{t('renamingPreview')}</h3>
                {processedItems.length > 0 && (
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded">
                        {previewIndex + 1} / {processedItems.length}
                    </span>
                )}
            </div>
            
            <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-6 min-h-[140px] flex items-center justify-center relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 to-transparent opacity-50 pointer-events-none"></div>

                {processedItems.length > 0 ? (
                    <div className="w-full relative z-10">
                        {isGroupingEnabled ? (
                             // Modo Agrupado (Lista)
                            <div className="space-y-2">
                                {((processedItems as File[][])[previewIndex] || []).map((file, i) => {
                                    const fileParts = file.name.split('.');
                                    const extension = fileParts.length > 1 ? fileParts.pop() : '';
                                    const newFileName = `${baseName.trim()}${previewIndex + 1}.${extension}`;

                                    return (
                                        <div key={i} className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-zinc-900/80 rounded-md border border-zinc-800/50">
                                            <span className="text-sm text-zinc-400 truncate max-w-[150px]" title={file.name}>{file.name}</span>
                                            <ArrowIcon className="w-4 h-4 text-zinc-600 rotate-90 sm:rotate-0" />
                                            <span className="text-sm font-bold text-green-400 break-all">{newFileName}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // Modo Único (Card)
                            (() => {
                                const file = (processedItems as File[])[previewIndex];
                                if (!file) return null;
                                const fileParts = file.name.split('.');
                                const extension = fileParts.length > 1 ? fileParts.pop() : '';
                                
                                // Lógica de Nome (Simplificada para exibição, real no worker)
                                const finalName = (baseName.toLowerCase() !== file.name.toLowerCase().split('.')[0] && !baseName.match(/\d+$/) && baseName.includes(' ')) 
                                    ? `${baseName.trim()}.${extension}` 
                                    : `${baseName.trim()}${previewIndex + 1}.${extension}`;

                                return (
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 max-w-full">
                                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Original</p>
                                            <p className="text-zinc-300 font-mono truncate max-w-[250px]" title={file.name}>{file.name}</p>
                                        </div>
                                        
                                        <div className="bg-zinc-800/50 p-2 rounded-full text-zinc-500">
                                            <ArrowIcon className="w-5 h-5 rotate-90" />
                                        </div>
                                        
                                        <div className="bg-green-900/10 px-6 py-3 rounded-lg border border-green-500/20 max-w-full shadow-[0_0_15px_rgba(74,222,128,0.05)]">
                                            <p className="text-xs text-green-500/70 uppercase font-bold mb-1">Novo Nome</p>
                                            <p className="text-green-400 font-bold font-mono text-lg break-all">{finalName}</p>
                                        </div>
                                    </div>
                                )
                            })()
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500 italic">{t('noFilesToPreview')}</p>
                )}
            </div>

            {/* Navigation Controls */}
            {processedItems.length > 1 && (
                <div className="flex items-center justify-between w-full mt-4 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                    <button 
                        onClick={onPrev} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Anterior
                    </button>
                    
                    <button 
                        onClick={onNext} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                    >
                        Próximo
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default RenamerPreview;
