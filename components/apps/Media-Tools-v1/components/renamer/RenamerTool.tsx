
import React, { useState, useCallback, useEffect } from 'react';
import FileUpload from '../FileUpload';
import { DownloadIcon, TrashIcon, UploadIcon, SortAscendingIcon, SortDescendingIcon, FileCodeIcon, CheckCircleIcon } from '../icons';
import { saveState, loadState, createWorker, ZIPPER_WORKER_CODE } from '../../utils';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressDisplay from '../common/ProgressDisplay';
import CompletionMessage from '../common/CompletionMessage';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import RenamerPreview from './RenamerPreview';
import SeoTagsGenerator, { TagSeparatorType } from '../common/SeoTagsGenerator';
import { generateSmartName, generateSeoReport } from '../../utils/seo';
import ToolSection from '../common/ToolSection';
import { Input } from '@/components/ui/Input';

const FILE_LIMIT = 150;

type SeparatorType = '-' | '_' | ' ' | '.';
type RenameMode = 'base' | 'smart';

const RenamerTool: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState(() => loadState('renamerToolSettings', {
        baseName: '',
        sortOrder: 'asc' as 'asc' | 'desc',
        isGroupingEnabled: true,
        renameMode: 'smart' as RenameMode,
    }));
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [baseNameError, setBaseNameError] = useState<string | null>(null);
    const [nameSeparator, setNameSeparator] = useState<SeparatorType>(' ');
    
    // Estado para Configurações de SEO (Lifted State)
    // FIX: includeCommercialTags default to false
    const [seoSettings, setSeoSettings] = useState({
        includeCommercialTags: false,
        useSynonyms: false
    });
    // Estado para o Separador de Tags (para o relatório)
    const [tagSeparator, setTagSeparator] = useState<TagSeparatorType>(', ');

    const { addToast } = useToast();
    const { t } = useLanguage();

    useEffect(() => {
        saveState('renamerToolSettings', settings);
    }, [settings]);

    const { baseName, sortOrder, isGroupingEnabled, renameMode } = settings;
    
    const setBaseName = (name: string) => {
        setSettings(s => ({ ...s, baseName: name }));
        if (baseNameError) setBaseNameError(null);
    };
    const setSortOrder = (order: 'asc' | 'desc') => setSettings(s => ({ ...s, sortOrder: order }));
    const setIsGroupingEnabled = (enabled: boolean) => setSettings(s => ({ ...s, isGroupingEnabled: enabled }));
    const setRenameMode = (mode: RenameMode) => setSettings(s => ({ ...s, renameMode: mode }));

    const effectiveGrouping = renameMode === 'smart' ? false : isGroupingEnabled;
    const processedItems = useFileProcessor(files, sortOrder, effectiveGrouping);

    // Auto-generate name logic
    useEffect(() => {
        if (files.length > 0 && renameMode === 'base' && !baseName) {
            const currentFile = files[0];
            const smartName = generateSmartName(currentFile.name, nameSeparator);
            setBaseName(smartName);
        }
    }, [files, nameSeparator, renameMode, baseName]);

    const handleFilesAdd = useCallback((newFiles: File[]) => {
        setFiles(currentFiles => {
            const combined = [...currentFiles, ...newFiles];
            const uniqueFiles = combined.filter((file, index, self) =>
                index === self.findIndex((f) => (
                    f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                ))
            );

            if (uniqueFiles.length > FILE_LIMIT) {
                addToast(t('fileLimitExceeded', { limit: FILE_LIMIT }), 'warning');
                return uniqueFiles.slice(0, FILE_LIMIT);
            }
            return uniqueFiles;
        });
        setPreviewIndex(0);
        setIsCompleted(false);
        setProcessedFilesCount(0);
    }, [addToast, t]);

    const handleFileRemove = useCallback((index: number) => {
        setFiles(currentFiles => currentFiles.filter((_, i) => i !== index));
        setIsCompleted(false);
        setProcessedFilesCount(0);
    }, []);

    const handleClearAll = useCallback(() => {
        setFiles([]);
        setPreviewIndex(0);
        localStorage.removeItem('mediaTools_renamerToolSettings');
        setSettings({ baseName: '', sortOrder: 'asc', isGroupingEnabled: true, renameMode: 'smart' });
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setBaseNameError(null);
    }, []);
    
    const handleNextPreview = useCallback(() => {
        if (processedItems.length === 0) return;
        setPreviewIndex(prev => (prev + 1) % processedItems.length);
    }, [processedItems.length]);

    const handlePrevPreview = useCallback(() => {
        if (processedItems.length === 0) return;
        setPreviewIndex(prev => (prev - 1 + processedItems.length) % processedItems.length);
    }, [processedItems.length]);

    const handleSortToggle = useCallback(() => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setPreviewIndex(0);
    }, [sortOrder]);
    
    const handleGroupingToggle = useCallback(() => {
        setIsGroupingEnabled(!isGroupingEnabled);
        setPreviewIndex(0);
    }, [isGroupingEnabled]);

    const handleDownloadReport = () => {
        if (files.length === 0) return;
        // Fix: Passando as configurações de SEO E o separador de tags para a função de geração
        const blob = generateSeoReport(files, nameSeparator, seoSettings, tagSeparator);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Relatorio_SEO_Arquivos.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        addToast("Relatório SEO gerado com sucesso!", "success");
    };

    const handleRenameAndDownload = useCallback(async () => {
        if (files.length === 0) {
            addToast(t('selectAtLeastOneFile'), 'warning');
            return;
        }
        if (renameMode === 'base' && !baseName.trim()) {
            setBaseNameError(t('enterBaseName'));
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setProcessedFilesCount(0);
        setIsCompleted(false);

        let worker: Worker | null = null;
        try {
            const workerUrl = createWorker(ZIPPER_WORKER_CODE);
            worker = new Worker(workerUrl);
            URL.revokeObjectURL(workerUrl);
        } catch (error) {
            console.error('Failed to create worker:', error);
            addToast(t('workerError'), 'error');
            setIsProcessing(false);
            return;
        }

        worker.onmessage = (e: MessageEvent) => {
            const { status, value, processedCount: workerProcessedCount } = e.data;
            if (status === 'progress') {
                setProgress(value);
                setProcessedFilesCount(workerProcessedCount);
            } else if (status === 'complete') {
                const { blob } = e.data;
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = t('renamedFilesZipName');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
                
                addToast(t('downloadStarted'), 'success');
                setIsProcessing(false);
                setFiles([]);
                setIsCompleted(true);
                worker?.terminate();
            } else if (status === 'error') {
                addToast(`${t('workerError')}: ${e.data.error}`, 'error');
                setIsProcessing(false);
                worker?.terminate();
            }
        };

        worker.onerror = (e) => {
            addToast(t('errorProcessingFiles'), 'error');
            console.error('Worker error:', e);
            setIsProcessing(false);
            worker?.terminate();
        };

        worker.postMessage({
            task: 'rename',
            files,
            settings: { 
                baseName, 
                sortOrder, 
                isGroupingEnabled: effectiveGrouping,
                renameMode,
                separator: nameSeparator 
            }
        });
    }, [files, baseName, sortOrder, effectiveGrouping, renameMode, nameSeparator, addToast, t]);
    
    const isGenerateDisabled = files.length === 0 || isProcessing;
    const isClearDisabled = files.length === 0 && baseName === '' && !isCompleted;

    const getSmartPreviewName = (file: File) => {
        return generateSmartName(file.name, nameSeparator);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
            <ToolSection title={t('selectFilesToRename')}>
                <FileUpload
                    title="Arraste arquivos aqui"
                    description={t('anyFile')}
                    onFilesAdd={handleFilesAdd}
                    onFileRemove={handleFileRemove}
                    onFilesClear={handleClearAll}
                    acceptedFormats="*/*"
                    isMultiple={true}
                    uploadedFile={files}
                    icon={<UploadIcon className="w-10 h-10 text-zinc-600" />}
                />
                
                {files.length > 0 && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSortToggle}
                            className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                        >
                            {sortOrder === 'asc' ? <SortAscendingIcon className="w-4 h-4" /> : <SortDescendingIcon className="w-4 h-4" />}
                            {t('sortByName', { order: sortOrder === 'asc' ? 'A-Z' : 'Z-A' })}
                        </button>
                    </div>
                )}
            </ToolSection>

            <ToolSection title="Configuração de Renomeação">
                {/* Mode Selector - Segmented Control */}
                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 mb-6 w-full max-w-md mx-auto">
                    <button
                        onClick={() => setRenameMode('smart')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            renameMode === 'smart' 
                            ? 'bg-zinc-800 text-white shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        Modo Inteligente (SEO)
                    </button>
                    <button
                        onClick={() => setRenameMode('base')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            renameMode === 'base' 
                            ? 'bg-zinc-800 text-white shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        Modo Sequencial
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Modo Sequencial Settings */}
                    {renameMode === 'base' && (
                        <div className="animate-fade-in space-y-4 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                             <div>
                                <label htmlFor="base-name" className="block text-sm font-medium text-zinc-300 mb-2">
                                    {t('baseNameForFiles')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="base-name"
                                        value={baseName}
                                        onChange={(e) => setBaseName(e.target.value)}
                                        placeholder={t('exampleBatchRenamer')}
                                        className={`w-full p-3 bg-zinc-900 border rounded-lg shadow-inner text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${baseNameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-700 focus:border-[#ff0e00] focus:ring-[#ff0e00]'}`}
                                    />
                                    {baseName && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {baseNameError && <p className="mt-1 text-xs text-red-500">{baseNameError}</p>}
                                <p className="text-xs text-zinc-500 mt-2">
                                    Resultado: <span className="font-mono text-zinc-400">{baseName || 'exemplo'}-1.jpg</span>
                                </p>
                            </div>

                             <div className="flex items-center gap-2">
                                <input
                                    id="group-files"
                                    type="checkbox"
                                    checked={isGroupingEnabled}
                                    onChange={handleGroupingToggle}
                                    className="focus:ring-[#ff0e00] h-4 w-4 text-[#ff0e00] border-zinc-600 rounded bg-zinc-800"
                                />
                                <label htmlFor="group-files" className="text-sm text-zinc-300 cursor-pointer select-none">
                                    {t('groupFilesWithSameName')}
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Separator Selection (Common) */}
                     <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">
                            Separador de Palavras
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { label: 'Espaço ( )', val: ' ' },
                                { label: 'Hífen (-)', val: '-' },
                                { label: 'Underline (_)', val: '_' },
                                { label: 'Ponto (.)', val: '.' },
                            ].map((opt) => (
                                <button
                                    key={opt.val}
                                    onClick={() => setNameSeparator(opt.val as SeparatorType)}
                                    className={`px-3 py-2 text-xs font-bold rounded-md border transition-all ${
                                        nameSeparator === opt.val 
                                        ? 'bg-[#ff0e00]/10 border-[#ff0e00] text-[#ff0e00]' 
                                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </ToolSection>

            {/* SEO Tags Integration with State Sharing */}
            {files.length > 0 && (
                <SeoTagsGenerator 
                    files={files} 
                    t={t}
                    externalSettings={seoSettings}
                    onSettingsChange={setSeoSettings}
                    externalTagSeparator={tagSeparator}
                    onTagSeparatorChange={setTagSeparator}
                />
            )}

            {files.length > 0 && (
                (renameMode === 'base' && baseName.trim() !== '') || (renameMode === 'smart')
            ) && (
                <RenamerPreview
                    processedItems={processedItems}
                    previewIndex={previewIndex}
                    baseName={renameMode === 'base' ? baseName : getSmartPreviewName((processedItems[previewIndex] as File))} 
                    isGroupingEnabled={effectiveGrouping}
                    t={t}
                    onPrev={handlePrevPreview}
                    onNext={handleNextPreview}
                />
            )}
            
            {files.length > 0 && (
                 <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md">
                    <button
                        onClick={handleClearAll}
                        disabled={isClearDisabled}
                        className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-6 text-sm"
                    >
                        <TrashIcon className="w-4 h-4" />
                        {t('clearSelection')}
                    </button>

                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('generateRenamedFiles')}</h3>
                    
                    {isCompleted ? (
                        <CompletionMessage onClear={handleClearAll} t={t} />
                    ) : (
                        <>
                            {isProcessing && (
                                <ProgressDisplay
                                    progress={progress}
                                    processedCount={processedFilesCount}
                                    totalFiles={processedItems.length}
                                    t={t}
                                />
                            )}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleDownloadReport}
                                    disabled={isGenerateDisabled}
                                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold py-3 px-4 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FileCodeIcon className="w-5 h-5" />
                                    Relatório SEO
                                </button>
                                <button
                                    onClick={handleRenameAndDownload}
                                    disabled={isGenerateDisabled}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff0e00] shadow-lg shadow-[#ff0e00]/20"
                                >
                                    <DownloadIcon className="w-6 h-6" />
                                    {isProcessing ? `${t('processing')}...` : `${t('renameAndDownload')} ${files.length > 0 ? `(${files.length})` : ''}`}
                                </button>
                            </div>
                        </>
                    )}
                 </div>
            )}
        </div>
    );
};

export default RenamerTool;
