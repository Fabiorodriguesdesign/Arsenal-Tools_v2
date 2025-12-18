
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import FileUpload from '../FileUpload';
import { ZipIcon, DownloadIcon, TrashIcon, SortAscendingIcon, SortDescendingIcon, RefreshIcon, LayersIcon } from '../icons';
import { saveState, loadState, createWorker, ZIPPER_WORKER_CODE } from '../../utils';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressDisplay from '../common/ProgressDisplay';
import CompletionMessage from '../common/CompletionMessage';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import ZipperPreview from './ZipperPreview';
import SeoTagsGenerator from '../common/SeoTagsGenerator';
import ToolSection from '../common/ToolSection';

const FILE_LIMIT = 150;

const ZipperTool: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState(() => loadState('zipperToolSettings', {
        baseName: '',
        sortOrder: 'asc' as 'asc' | 'desc',
    }));
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    const [zipPreviewIndex, setZipPreviewIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const { addToast } = useToast();
    const { t } = useLanguage();

    useEffect(() => {
        saveState('zipperToolSettings', settings);
    }, [settings]);

    const { baseName, sortOrder } = settings;
    const setBaseName = (name: string) => setSettings(s => ({ ...s, baseName: name }));
    const setSortOrder = (order: 'asc' | 'desc') => setSettings(s => ({ ...s, sortOrder: order }));

    // Sempre processa agrupamento para visualização
    const groupedAndSortedFiles = useFileProcessor(files, sortOrder, true) as File[][];

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
        setZipPreviewIndex(0);
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
        localStorage.removeItem('mediaTools_zipperToolSettings');
        setSettings({ baseName: '', sortOrder: 'asc' });
        setZipPreviewIndex(0);
        setIsCompleted(false);
        setProcessedFilesCount(0);
    }, []);
    
    const handleSortToggle = useCallback(() => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setZipPreviewIndex(0);
    }, [sortOrder]);

    const handleNextZipPreview = useCallback(() => {
        if (groupedAndSortedFiles.length === 0) return;
        setZipPreviewIndex(prev => (prev + 1) % groupedAndSortedFiles.length);
    }, [groupedAndSortedFiles.length]);

    const handlePrevZipPreview = useCallback(() => {
        if (groupedAndSortedFiles.length === 0) return;
        setZipPreviewIndex(prev => (prev - 1 + groupedAndSortedFiles.length) % groupedAndSortedFiles.length);
    }, [groupedAndSortedFiles.length]);

    const groupingStats = useMemo(() => {
        const totalGroups = groupedAndSortedFiles.length;
        const groupsWithMultiple = groupedAndSortedFiles.filter(g => g.length > 1).length;
        return { totalGroups, groupsWithMultiple };
    }, [groupedAndSortedFiles]);
    
    const handleGenerateZips = useCallback(async () => {
        if (files.length === 0) {
            addToast(t('selectAtLeastOneFile'), 'warning');
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
                link.download = t('groupedFilesZipName');
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
            task: 'zip',
            files,
            settings: { baseName, sortOrder }
        });
    }, [files, baseName, sortOrder, addToast, t]);
    
    const isGenerateDisabled = files.length === 0 || isProcessing;
    const isClearDisabled = files.length === 0 && baseName === '' && !isCompleted;
    
    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
             <ToolSection title={t('selectFilesToGroup')}>
                <FileUpload
                    title="Arraste arquivos aqui"
                    description={t('anyFile')}
                    onFilesAdd={handleFilesAdd}
                    onFileRemove={handleFileRemove}
                    onFilesClear={handleClearAll}
                    acceptedFormats="*/*"
                    isMultiple={true}
                    uploadedFile={files}
                    icon={<ZipIcon className="w-10 h-10 text-zinc-600" />}
                />
                
                {files.length > 0 && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSortToggle}
                            className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                        >
                            {sortOrder === 'asc' ? <SortAscendingIcon className="w-4 h-4" /> : <SortDescendingIcon className="w-4 h-4" />}
                            {t('sortGroupsByName', { order: sortOrder === 'asc' ? 'A-Z' : 'Z-A' })}
                        </button>
                    </div>
                )}
            </ToolSection>
            
            <ToolSection title="Configuração do ZIP">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="zip-base-name" className="block text-sm font-medium text-zinc-300 mb-2">
                            {t('baseNameForZipFilesInput')}
                        </label>
                        <input
                            type="text"
                            id="zip-base-name"
                            value={baseName}
                            onChange={(e) => setBaseName(e.target.value)}
                            placeholder={t('exampleBatchZipper')}
                            className="w-full p-3 bg-zinc-950 border border-zinc-700 rounded-lg shadow-inner text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:border-[#ff0e00] focus:ring-[#ff0e00] transition-all"
                        />
                         <p className="mt-2 text-xs text-zinc-500">
                            {t('zipNamingConvention')}
                        </p>
                    </div>
                </div>
            </ToolSection>

            {/* SEO Generator Integration */}
            {files.length > 0 && (
                <SeoTagsGenerator files={files} t={t} />
            )}

            {files.length > 0 && (
                <ZipperPreview
                    groupedAndSortedFiles={groupedAndSortedFiles}
                    zipPreviewIndex={zipPreviewIndex}
                    baseName={baseName}
                    t={t}
                    onPrev={handlePrevZipPreview}
                    onNext={handleNextZipPreview}
                />
            )}

             <ToolSection>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-zinc-100">{t('generateGroupedZips')}</h3>
                 </div>
                 
                 {files.length > 0 && (
                     <div className="text-sm text-zinc-400 mb-6 bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex items-start gap-3">
                        <LayersIcon className="w-5 h-5 text-[#ff0e00] mt-0.5 flex-shrink-0" />
                        <div>
                             <p className="text-zinc-200 font-semibold mb-1">Resumo do Processamento:</p>
                             <ul className="space-y-1 list-disc list-inside text-zinc-400 text-xs">
                                <li><strong>{files.length}</strong> arquivos originais.</li>
                                <li>Serão gerados <strong>{groupingStats.totalGroups}</strong> arquivos ZIP.</li>
                                {groupingStats.groupsWithMultiple > 0 && (
                                    <li className="text-green-400">
                                        <strong>{groupingStats.groupsWithMultiple}</strong> ZIPs conterão múltiplos arquivos (agrupados por nome).
                                    </li>
                                )}
                             </ul>
                        </div>
                     </div>
                 )}

                 {isCompleted ? (
                    <CompletionMessage onClear={handleClearAll} t={t} />
                ) : (
                    <>
                        {isProcessing && (
                            <ProgressDisplay
                                progress={progress}
                                processedCount={processedFilesCount}
                                totalFiles={groupedAndSortedFiles.length}
                                t={t}
                            />
                        )}
                        
                         <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleClearAll}
                                disabled={isClearDisabled}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 font-bold py-3 px-6 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <TrashIcon className="w-5 h-5" />
                                {t('clear')}
                            </button>

                            <button
                                onClick={handleGenerateZips}
                                disabled={isGenerateDisabled}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff0e00] shadow-lg shadow-[#ff0e00]/20"
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshIcon className="w-5 h-5 animate-spin" />
                                        {t('processing')}...
                                    </>
                                ) : (
                                    <>
                                        <DownloadIcon className="w-6 h-6"/>
                                        {t('generateAndDownload')} {groupedAndSortedFiles.length > 0 ? `(${groupedAndSortedFiles.length} ZIPs)` : ''}
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
             </ToolSection>
        </div>
    );
};

export default ZipperTool;
