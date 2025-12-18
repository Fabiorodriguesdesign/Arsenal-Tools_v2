
import React, { useState, useCallback, useEffect, useRef } from 'react';
import FileUpload from '../FileUpload';
import Checkbox from '../Checkbox';
import { DownloadIcon, TrashIcon, WebpIcon, LinkIcon, UnlinkIcon, XCircleIcon } from '../icons';
import { useToast } from '../../contexts/ToastContext';
import { saveState, loadState, createWorker, WEBP_WORKER_CODE } from '../../utils';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressDisplay from '../common/ProgressDisplay';
import CompletionMessage from '../common/CompletionMessage';
import ErrorAlert from '../common/ErrorAlert';
import { NumberInput } from '../../../../ui/NumberInput';

declare var JSZip: any;

const panelClasses = "bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md";
const FILE_LIMIT = 100;
const MAX_DIMENSION = 8000;

const ImgToWebp: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState(() => loadState('imgToWebpSettings', {
        quality: 90,
        width: 1920,
        height: 1080,
        isDimensionsLinked: true,
        isResizingEnabled: false,
    }));
    const [customFileName, setCustomFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    const [failedFiles, setFailedFiles] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const { addToast } = useToast();
    const { t } = useLanguage();
    
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        saveState('imgToWebpSettings', settings);
    }, [settings]);

    const { quality, width, height, isDimensionsLinked, isResizingEnabled } = settings;

    const setQuality = (q: number) => setSettings(s => ({ ...s, quality: Math.min(100, Math.max(1, q)) }));
    const setWidth = (w: number) => setSettings(s => ({ ...s, width: w }));
    const setHeight = (h: number) => setSettings(s => ({ ...s, height: h }));
    const setIsDimensionsLinked = (linked: boolean) => setSettings(s => ({ ...s, isDimensionsLinked: linked }));
    const setIsResizingEnabled = (enabled: boolean) => setSettings(s => ({ ...s, isResizingEnabled: enabled }));

    const adjustQuality = (amount: number) => {
        setQuality(quality + amount);
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
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
    };

    const handleFileRemove = (index: number) => {
        setFiles(currentFiles => currentFiles.filter((_, i) => i !== index));
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
    };

    const handleClearAll = () => {
        setFiles([]);
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
        setCustomFileName('');
    };

    const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
        const clampedValue = Math.max(1, Math.min(MAX_DIMENSION, value));
    
        if (isDimensionsLinked && width > 0 && height > 0) {
            const aspectRatio = width / height;
            if (dimension === 'width') {
                setWidth(clampedValue);
                setHeight(Math.max(1, Math.round(clampedValue / aspectRatio)));
            } else {
                setHeight(clampedValue);
                setWidth(Math.max(1, Math.round(clampedValue * aspectRatio)));
            }
        } else {
            if (dimension === 'width') setWidth(clampedValue);
            else setHeight(clampedValue);
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

    const handleConvertAndDownload = useCallback(async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setProgress(0);
        setProcessedFilesCount(0);
        setFailedFiles([]);
        setIsCompleted(false);
        
        const zip = new JSZip();
        
        try {
            const workerUrl = createWorker(WEBP_WORKER_CODE);
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
                    let fileName = '';
                    
                    if (customFileName.trim()) {
                        if (workerTotalFiles > 1) {
                             fileName = `${customFileName.trim()}-${successfulFiles + 1}.webp`;
                        } else {
                             fileName = `${customFileName.trim()}.webp`;
                        }
                    } else {
                        const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
                        fileName = `${baseName}.webp`;
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
                        link.download = 'WebP_Images.zip';
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
                    addToast(t('noImagesConverted'), 'error');
                }
                setIsProcessing(false);
                setProgress(0);
            }
        };
        
        workerRef.current.onerror = (e) => {
            console.error(t('unexpectedErrorConverting'), e);
            addToast(t('unexpectedErrorConverting'), 'error');
            setIsProcessing(false);
            setProgress(0);
            workerRef.current?.terminate();
            workerRef.current = null;
        };

        workerRef.current.postMessage({
            files,
            settings: { quality, width, height, isResizingEnabled, isDimensionsLinked }
        });

    }, [files, quality, width, height, isResizingEnabled, isDimensionsLinked, customFileName, addToast, t]);

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const isGenerateDisabled = files.length === 0 || isProcessing;
    const isClearDisabled = files.length === 0 && !isCompleted;
    
    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
            <div className={panelClasses}>
                <FileUpload
                    title={t('selectImagesToConvert')}
                    description={t('anyImageFile')}
                    onFilesAdd={handleFilesAdd}
                    onFileRemove={handleFileRemove}
                    onFilesClear={() => setFiles([])}
                    acceptedFormats="image/*"
                    isMultiple={true}
                    uploadedFile={files}
                    icon={<WebpIcon className="w-10 h-10 text-zinc-600" />}
                />
            </div>

            <div className={panelClasses}>
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('conversionSettings')}</h3>
                
                <div className="space-y-6">
                    {/* Qualidade */}
                    <div>
                        <NumberInput
                            label={t('webpQuality', { quality })}
                            value={quality}
                            onChange={setQuality}
                            min={1}
                            max={100}
                            step={10}
                        />
                    </div>

                    {/* Checkbox Redimensionar */}
                    <div className="pt-4 border-t border-zinc-800">
                        <Checkbox
                            id="resize-images"
                            checked={isResizingEnabled}
                            onChange={() => setIsResizingEnabled(!isResizingEnabled)}
                            label={
                                <div className="text-sm">
                                    <span className="font-medium text-zinc-200">{t('resizeImages')}</span>
                                    <p className="text-zinc-400 text-xs">{t('uncheckToConvertOnly')}</p>
                                </div>
                            }
                        />
                    </div>

                    {/* Controles de Redimensionamento */}
                    {isResizingEnabled && (
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 animate-fade-in">
                             <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex-1 w-full">
                                    <NumberInput 
                                        label={t('widthPx')}
                                        value={width}
                                        onChange={(v) => handleDimensionChange('width', v)}
                                        min={1}
                                        max={MAX_DIMENSION}
                                        step={10}
                                    />
                                </div>
                                <div className="flex items-center justify-center pt-5">
                                    <button
                                        onClick={() => setIsDimensionsLinked(!isDimensionsLinked)}
                                        className={`p-2.5 rounded-full hover:bg-zinc-800 text-zinc-400 transition-all ${isDimensionsLinked ? 'bg-[#ff0e00]/10 text-[#ff0e00] ring-1 ring-[#ff0e00]/50' : 'bg-zinc-900 border border-zinc-700'}`}
                                        title={isDimensionsLinked ? t('dimensionsSynchronized') : t('dimensionsIndependent')}
                                    >
                                        {isDimensionsLinked ? <LinkIcon className="w-5 h-5" /> : <UnlinkIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="flex-1 w-full">
                                     <NumberInput 
                                        label={t('heightPx')}
                                        value={height}
                                        onChange={(v) => handleDimensionChange('height', v)}
                                        min={1}
                                        max={MAX_DIMENSION}
                                        step={10}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500 mt-3 text-center">
                                {t('dimensionLimit', { limit: MAX_DIMENSION })}
                            </p>
                        </div>
                    )}

                    {/* Nome do Arquivo */}
                    <div className="pt-4 border-t border-zinc-800">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Nome do Arquivo (Opcional)</label>
                        <input 
                            type="text" 
                            value={customFileName}
                            onChange={(e) => setCustomFileName(e.target.value)}
                            placeholder={files.length > 1 ? "Ex: foto-produto (gera foto-produto-1.webp...)" : "Ex: minha-imagem"}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2.5 text-sm text-zinc-100 focus:ring-[#ff0e00] focus:border-[#ff0e00]"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Deixe em branco para manter o nome original.</p>
                    </div>
                </div>
            </div>

             <div className={panelClasses}>
                <button
                    onClick={handleClearAll}
                    disabled={isClearDisabled}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors disabled:bg-zinc-900 disabled:text-zinc-500 disabled:cursor-not-allowed"
                >
                    <TrashIcon className="w-5 h-5" />
                    {t('clearSelection')}
                </button>
            </div>

             <div className={panelClasses}>
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('convertAndDownload')}</h3>
                {isCompleted ? (
                    <CompletionMessage onClear={handleClearAll} t={t} />
                ) : (
                    <>
                        {isProcessing && (
                            <div className="mb-4">
                                <ProgressDisplay
                                    progress={progress}
                                    processedCount={processedFilesCount}
                                    totalFiles={files.length}
                                    t={t}
                                />
                                <button
                                    onClick={handleCancel}
                                    className="w-full flex items-center justify-center gap-2 bg-transparent border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-zinc-900 mt-2"
                                >
                                    <XCircleIcon className="w-5 h-5" />
                                    {t('cancelProcessing')}
                                </button>
                            </div>
                        )}
                        <ErrorAlert failedFiles={failedFiles} t={t} />
                        {!isProcessing && (
                            <button
                                onClick={handleConvertAndDownload}
                                disabled={isGenerateDisabled}
                                className="w-full flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff0e00] dark:focus:ring-offset-zinc-900"
                            >
                                <DownloadIcon className="w-6 h-6" />
                                {t('convertAndDownload')} {files.length > 0 ? `(${files.length})` : ''} {t('images')}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ImgToWebp;