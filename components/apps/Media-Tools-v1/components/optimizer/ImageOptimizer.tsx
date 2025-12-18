
import React, { useState, useCallback, useEffect, useRef } from 'react';
import FileUpload from '../FileUpload';
import { DownloadIcon, TrashIcon, CompressIcon, ArrowLeftIcon, ArrowRightIcon, XCircleIcon } from '../icons';
import { useToast } from '../../contexts/ToastContext';
import { saveState, loadState, createWorker, OPTIMIZER_WORKER_CODE } from '../../utils';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressDisplay from '../common/ProgressDisplay';
import CompletionMessage from '../common/CompletionMessage';
import ErrorAlert from '../common/ErrorAlert';
import OptimizerPreview from './OptimizerPreview';
import ToolSection from '../common/ToolSection';
import SeoTagsGenerator from '../common/SeoTagsGenerator';
import { generateSmartName } from '../../utils/seo';
import OutputSettingsPanel from '../common/OutputSettingsPanel';
import OptimizerSettingsPanel from './OptimizerSettingsPanel';

declare var JSZip: any;

const FILE_LIMIT = 150;
const MAX_DIMENSION = 8000;
type RenameMode = 'base' | 'smart';
type SeparatorType = '-' | '_' | ' ' | '.';

const ImageOptimizer: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState(() => loadState('imageOptimizerSettings', {
        quality: 80,
        maxWidth: 1920,
        maxHeight: 1920,
        isDimensionsLinked: true,
        isResizingEnabled: true,
        renameMode: 'smart' as RenameMode,
        baseName: '',
        separator: ' ' as SeparatorType
    }));
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    const [failedFiles, setFailedFiles] = useState<string[]>([]);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
    const { addToast } = useToast();
    const { t } = useLanguage();
    
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        saveState('imageOptimizerSettings', settings);
    }, [settings]);

    const { quality, maxWidth, maxHeight, isDimensionsLinked, isResizingEnabled, renameMode, baseName, separator } = settings;

    // Settings Setters
    const updateSettings = (key: string, value: any) => setSettings(s => ({ ...s, [key]: value }));

    // Auto-fill baseName for display only in base mode
    useEffect(() => {
        if (files.length > 0 && renameMode === 'base' && !baseName) {
            const currentFile = files[previewIndex] || files[0];
            const smartName = generateSmartName(currentFile.name, separator);
            updateSettings('baseName', smartName);
        }
    }, [files, previewIndex, separator, renameMode, baseName]);

    const adjustQuality = (amount: number) => {
        updateSettings('quality', Math.min(100, Math.max(1, quality + amount)));
    };

    const handleFilesAdd = (newFiles: File[]) => {
        const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
        setFiles(currentFiles => {
            const combined = [...currentFiles, ...imageFiles];
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
        setFailedFiles([]);
    };

    const handleFileRemove = (index: number) => {
        setFiles(currentFiles => currentFiles.filter((_, i) => i !== index));
        setPreviewIndex(prev => (prev >= files.length - 1 && files.length > 1) ? 0 : prev);
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
    };

    const handleClearAll = () => {
        setFiles([]);
        localStorage.removeItem('mediaTools_imageOptimizerSettings');
        setSettings({ 
            quality: 80, maxWidth: 1920, maxHeight: 1920, isDimensionsLinked: true, isResizingEnabled: true,
            renameMode: 'smart', baseName: '', separator: ' '
        });
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
    };

    const handleDimensionChange = (dimension: 'width' | 'height') => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number(e.target.value);
        if (isNaN(value)) return;
        value = Math.max(1, value);
    
        if (isDimensionsLinked) {
            const currentRatio = maxWidth > 0 && maxHeight > 0 ? maxWidth / maxHeight : 1;
            if (dimension === 'width') {
                const newWidth = Math.min(MAX_DIMENSION, value);
                const newHeight = Math.max(1, Math.round(newWidth / currentRatio));
                updateSettings('maxWidth', newWidth);
                updateSettings('maxHeight', Math.min(MAX_DIMENSION, newHeight));
            } else {
                const newHeight = Math.min(MAX_DIMENSION, value);
                const newWidth = Math.max(1, Math.round(newHeight * currentRatio));
                updateSettings('maxHeight', newHeight);
                updateSettings('maxWidth', Math.min(MAX_DIMENSION, newWidth));
            }
        } else {
            updateSettings(dimension === 'width' ? 'maxWidth' : 'maxHeight', Math.min(MAX_DIMENSION, value));
        }
    };
    
    const handleCancel = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
        setIsProcessing(false);
        setProgress(0);
        setProcessedFilesCount(0);
        addToast(t('processCanceled'), 'warning');
    }, [addToast, t]);

    const handleOptimizeAndDownload = useCallback(async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setProgress(0);
        setProcessedFilesCount(0);
        setFailedFiles([]);
        setIsCompleted(false);
        
        const zip = new JSZip();
        
        try {
            const workerUrl = createWorker(OPTIMIZER_WORKER_CODE);
            workerRef.current = new Worker(workerUrl);
            URL.revokeObjectURL(workerUrl);
        } catch (error) {
            console.error('Failed to create worker:', error);
            addToast(t('workerError'), 'error');
            setIsProcessing(false);
            return;
        }

        const localFailedFiles: string[] = [];
        let successfulFiles = 0;
        
        workerRef.current.onmessage = (e: MessageEvent) => {
            const { status, blob, originalFileName, error, processedCount: workerProcessedCount, totalFiles: workerTotalFiles } = e.data;

            if (status === 'progress' || status === 'error') {
                setProcessedFilesCount(workerProcessedCount);
                if (status === 'progress' && blob) {
                    let fileName = originalFileName;
                    if (zip.file(fileName)) {
                        fileName = fileName.replace('.jpg', `_${successfulFiles}.jpg`);
                    }
                    zip.file(fileName, blob);
                    successfulFiles++;
                } else if (status === 'error') {
                    console.error(`${t('failedToProcess')} ${originalFileName}:`, error);
                    localFailedFiles.push(originalFileName);
                }
                setProgress(Math.round((workerProcessedCount / workerTotalFiles) * 100));
            }

            if (workerProcessedCount === workerTotalFiles) {
                workerRef.current?.terminate();
                workerRef.current = null;
                setFailedFiles(localFailedFiles);
                
                if (successfulFiles > 0) {
                    zip.generateAsync({ type: 'blob' }).then((zipBlob: Blob) => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(zipBlob);
                        link.download = 'Optimized_Images.zip';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(link.href);
                        addToast(t('downloadStarted'), 'success');
                        setFiles([]);
                        setIsCompleted(true);
                    });
                } else if (localFailedFiles.length === files.length) {
                    addToast(t('allFilesFailed'), 'error');
                } else {
                    addToast(t('noImagesOptimized'), 'error');
                }
                setIsProcessing(false);
                setProgress(0);
            }
        };
        
        workerRef.current.onerror = (e) => {
            addToast(t('unexpectedErrorOptimizing'), 'error');
            setIsProcessing(false);
            workerRef.current?.terminate();
            workerRef.current = null;
        };

        workerRef.current.postMessage({
            files,
            settings: { 
                quality, maxWidth, maxHeight, isResizingEnabled,
                renameMode, baseName: renameMode === 'base' ? baseName : '', separator
            }
        });

    }, [files, quality, maxWidth, maxHeight, isResizingEnabled, renameMode, baseName, separator, addToast, t]);

    useEffect(() => {
        return () => {
            if (workerRef.current) workerRef.current.terminate();
        };
    }, []);

    const isGenerateDisabled = files.length === 0 || isProcessing;
    const isClearDisabled = files.length === 0 && !isCompleted;

    const formatBytes = (bytes: number | null) => {
        if (bytes === null || isNaN(bytes) || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
            <ToolSection title={t('selectImagesToOptimize')}>
                <FileUpload
                    title={t('selectImagesToOptimize')}
                    description={t('anyImageFile')}
                    onFilesAdd={handleFilesAdd}
                    onFileRemove={handleFileRemove}
                    onFilesClear={() => setFiles([])}
                    acceptedFormats="image/*"
                    isMultiple={true}
                    uploadedFile={files}
                    icon={<CompressIcon className="w-10 h-10 text-zinc-600" />}
                />
            </ToolSection>
            
            {files.length > 0 && (
                <ToolSection title={t('interactivePreview')} className="animate-fade-in">
                     <OptimizerPreview
                        file={files[previewIndex]}
                        settings={settings}
                        onOptimizedSizeChange={setOptimizedSize}
                        t={t}
                     />
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-sm font-medium text-zinc-400">{t('originalSize')}</p>
                            <p className="text-lg font-semibold text-zinc-100">{files[previewIndex] ? formatBytes(files[previewIndex].size) : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">{t('optimizedSizeEstimated')}</p>
                            <p className="text-lg font-semibold text-green-400">{optimizedSize === null ? t('calculating') : formatBytes(optimizedSize)}</p>
                        </div>
                    </div>

                     {files.length > 1 && (
                         <div className="flex items-center justify-between w-full max-w-xs mx-auto mt-4">
                            <button onClick={() => setPreviewIndex(p => (p - 1 + files.length) % files.length)} className="p-2 rounded-full bg-[#ff0e00] text-white hover:bg-[#e00c00] transition-colors"> <ArrowLeftIcon className="w-5 h-5" /> </button>
                            <span className="font-medium text-zinc-200">{previewIndex + 1} / {files.length}</span>
                            <button onClick={() => setPreviewIndex(p => (p + 1) % files.length)} className="p-2 rounded-full bg-[#ff0e00] text-white hover:bg-[#e00c00] transition-colors"> <ArrowRightIcon className="w-5 h-5" /> </button>
                        </div>
                     )}
                </ToolSection>
            )}

            <ToolSection title={t('optimizationSettings')}>
                <OptimizerSettingsPanel 
                    quality={quality}
                    setQuality={(v) => updateSettings('quality', v)}
                    maxWidth={maxWidth}
                    setMaxWidth={(v) => updateSettings('maxWidth', v)}
                    maxHeight={maxHeight}
                    setMaxHeight={(v) => updateSettings('maxHeight', v)}
                    isDimensionsLinked={isDimensionsLinked}
                    setIsDimensionsLinked={(v) => updateSettings('isDimensionsLinked', v)}
                    isResizingEnabled={isResizingEnabled}
                    setIsResizingEnabled={(v) => updateSettings('isResizingEnabled', v)}
                    handleDimensionChange={handleDimensionChange}
                    adjustQuality={adjustQuality}
                    t={t}
                />
            </ToolSection>

             <ToolSection title={t('outputSettings')}>
                 <OutputSettingsPanel 
                    renameMode={renameMode}
                    setRenameMode={(v) => updateSettings('renameMode', v)}
                    baseName={baseName}
                    setBaseName={(v) => updateSettings('baseName', v)}
                    separator={separator}
                    setSeparator={(v) => updateSettings('separator', v)}
                    t={t}
                 />
            </ToolSection>
            
            {files.length > 0 && <SeoTagsGenerator files={files} t={t} />}

             <ToolSection>
                <button
                    onClick={handleClearAll}
                    disabled={isClearDisabled}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors disabled:bg-zinc-900 disabled:text-zinc-500 disabled:cursor-not-allowed"
                >
                    <TrashIcon className="w-5 h-5" />
                    {t('clearSelection')}
                </button>
            </ToolSection>

             <ToolSection title={t('optimizeAndDownload')}>
                 {isCompleted ? (
                    <CompletionMessage onClear={handleClearAll} t={t} />
                ) : (
                    <>
                        {isProcessing && (
                            <div className="mb-4">
                                <ProgressDisplay progress={progress} processedCount={processedFilesCount} totalFiles={files.length} t={t} />
                                <button onClick={handleCancel} className="w-full flex items-center justify-center gap-2 bg-transparent border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-950/30 transition-colors mt-2">
                                    <XCircleIcon className="w-5 h-5" />
                                    {t('cancelProcessing')}
                                </button>
                            </div>
                        )}
                        <ErrorAlert failedFiles={failedFiles} t={t} />
                        <button
                            onClick={handleOptimizeAndDownload}
                            disabled={isGenerateDisabled}
                            className="w-full flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-lg shadow-[#ff0e00]/20"
                        >
                            <DownloadIcon className="w-6 h-6" />
                            {t('optimizeAndDownload')} {files.length > 0 ? `(${files.length})` : ''} {t('images')}
                        </button>
                    </>
                )}
            </ToolSection>
        </div>
    );
};

export default ImageOptimizer;