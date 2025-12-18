
import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ZipIcon, FileCodeIcon } from '../icons';

interface ZipperPreviewProps {
    groupedAndSortedFiles: File[][];
    zipPreviewIndex: number;
    baseName: string;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    onPrev: () => void;
    onNext: () => void;
}

const panelClasses = "bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md";

const ZipperPreview: React.FC<ZipperPreviewProps> = ({
    groupedAndSortedFiles,
    zipPreviewIndex,
    baseName,
    t,
    onPrev,
    onNext
}) => {
    
    // Obter o nome base do grupo atual para exibição
    const currentGroup = groupedAndSortedFiles[zipPreviewIndex] || [];
    let displayZipName = "";
    
    if (currentGroup.length > 0) {
        // Se o usuário definiu um Base Name (modo sequencial)
        if (baseName.trim()) {
            displayZipName = `${baseName.trim()}${zipPreviewIndex + 1}.zip`;
        } else {
            // Se não, usa o nome do arquivo (modo agrupamento natural)
            const firstFileName = currentGroup[0].name;
            const lastDotIndex = firstFileName.lastIndexOf('.');
            const nameWithoutExt = lastDotIndex > 0 ? firstFileName.substring(0, lastDotIndex) : firstFileName;
            displayZipName = `${nameWithoutExt}.zip`;
        }
    }

    return (
        <div className={panelClasses}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">{t('renamingPreview')}</h3>
                 {groupedAndSortedFiles.length > 0 && (
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        Grupo {zipPreviewIndex + 1} de {groupedAndSortedFiles.length}
                    </span>
                )}
            </div>

            <div className="bg-zinc-950/50 p-6 rounded-lg min-h-[160px] flex items-center justify-center border border-zinc-800/50 relative overflow-hidden">
                {/* Background Decorativo */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 to-transparent opacity-30 pointer-events-none"></div>

                {groupedAndSortedFiles.length > 0 ? (
                    <div className="w-full max-w-md relative z-10">
                        {/* Visual do ZIP */}
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-[#ff0e00]/10 hover:border-[#ff0e00]/30">
                            {/* Header do ZIP */}
                            <div className="bg-zinc-800/80 p-3 flex items-center gap-3 border-b border-zinc-700">
                                <div className="p-1.5 bg-[#ff0e00]/10 rounded text-[#ff0e00]">
                                    <ZipIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate" title={displayZipName}>
                                        {displayZipName}
                                    </p>
                                    <p className="text-[10px] text-zinc-400">Arquivo ZIP Final</p>
                                </div>
                            </div>
                            
                            {/* Conteúdo do ZIP (Lista de Arquivos) */}
                            <div className="p-2 bg-zinc-900/50 max-h-40 overflow-y-auto custom-scrollbar">
                                {currentGroup.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-md transition-colors group">
                                        <FileCodeIcon className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-zinc-300 truncate font-mono">{file.name}</p>
                                            <p className="text-[10px] text-zinc-600">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Footer do ZIP */}
                            <div className="bg-zinc-950 p-2 text-center border-t border-zinc-800">
                                <p className="text-[10px] text-zinc-500">
                                    Contém {currentGroup.length} arquivo{currentGroup.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-zinc-500">
                        <ZipIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">{t('noGroupsToPreview')}</p>
                    </div>
                )}
            </div>

            {/* Controles de Navegação */}
            {groupedAndSortedFiles.length > 1 && (
                <div className="flex items-center justify-between w-full mt-4 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                    <button 
                        onClick={onPrev} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#ff0e00]"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Anterior
                    </button>
                    
                    <button 
                        onClick={onNext} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#ff0e00]"
                    >
                        Próximo
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ZipperPreview;
