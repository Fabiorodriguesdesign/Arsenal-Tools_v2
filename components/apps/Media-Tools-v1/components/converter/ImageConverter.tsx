
import React, { useState, useCallback, useEffect, useRef } from 'react';
import FileUpload from '../FileUpload';
import { DownloadIcon, TrashIcon, SwitchHorizontalIcon, XCircleIcon } from '../icons';
import { useToast } from '../../contexts/ToastContext';
import { saveState, loadState, createWorker, CONVERTER_WORKER_CODE } from '../../utils';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressDisplay from '../common/ProgressDisplay';
import CompletionMessage from '../common/CompletionMessage';
import ErrorAlert from '../common/ErrorAlert';
import ToolSection from '../common/ToolSection';
import SeoTagsGenerator from '../common/SeoTagsGenerator';
import { generateSmartName } from '../../utils/seo';
import OutputSettingsPanel from '../common/OutputSettingsPanel';
import ConverterSettingsPanel from './ConverterSettingsPanel';

declare var JSZip: any;

type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'tiff';
const FILE_LIMIT = 150;
type RenameMode = 'base' | 'smart';
type SeparatorType = '-' | '_' | ' ' | '.';

const ImageConverter: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState(() => loadState('imageConverterSettings', {
        outputFormat: 'jpeg' as OutputFormat,
        backgroundColor: '#FFFFFF',
        keepTransparency: true,
        renameMode: 'smart' as RenameMode,
        baseName: '',
        separator: ' ' as SeparatorType
    }));
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    const [failedFiles, setFailedFiles] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const { addToast } = useToast();
    const { t } = useLanguage();
    
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        saveState('imageConverterSettings', settings);
    }, [settings]);

    const { outputFormat, backgroundColor, keepTransparency, renameMode, baseName, separator } = settings;
    
    const updateSettings = (key: string, value: any) => setSettings(s => ({ ...s, [key]: value }));

    // Auto-fill baseName for display only in base mode
    useEffect(() => {
        if (files.length > 0 && renameMode === 'base' && !baseName) {
            const currentFile = files[0];
            const smartName = generateSmartName(currentFile.name, separator);
            updateSettings('baseName', smartName);
        }
    }, [files, separator, renameMode, baseName]);

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
        localStorage.removeItem('mediaTools_imageConverterSettings');
        setSettings({ outputFormat: 'jpeg', backgroundColor: '#FFFFFF', keepTransparency: true, renameMode: 'smart', baseName: '', separator: ' ' });
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
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
        
        const zip = new JSZip();
        
        try {
            const workerUrl = createWorker(CONVERTER_WORKER_CODE);
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
                    // Check for duplicate names
                    let fileName = originalFileName;
                    if (zip.file(fileName)) {
                        const parts = fileName.split('.');
                        const ext = parts.pop();
                        const base = parts.join('.');
                        fileName = `${base}_${successfulFiles}.${ext}`;
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

                if (Object.keys(zip.files).length > 0) {
                    zip.generateAsync({ type: 'blob' }).then((zipBlob: Blob) => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(zipBlob);
                        link.download = 'Converted_Images.zip';
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
            addToast(t('unexpectedErrorConverting'), 'error');
            setIsProcessing(false);
            workerRef.current?.terminate();
            workerRef.current = null;
        };

        workerRef.current.postMessage({ files, settings });

    }, [files, settings, addToast, t]);
    
    useEffect(() => {
        return () => {
            if (workerRef.current) workerRef.current.terminate();
        };
    }, []);
    
    const isGenerateDisabled = files.length === 0 || isProcessing;
    const isClearDisabled = files.length === 0 && !isCompleted;

    return (
         <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
            <ToolSection>
                <FileUpload
                    title={t('selectImagesToConvert')}
                    description={t('anyImageFile')}
                    onFilesAdd={handleFilesAdd}
                    onFileRemove={handleFileRemove}
                    onFilesClear={() => setFiles([])}
                    acceptedFormats="image/*"
                    isMultiple={true}
                    uploadedFile={files}
                    icon={<SwitchHorizontalIcon className="w-10 h-10 text-zinc-600" />}
                />
            </ToolSection>

            <ToolSection title={t('conversionSettings')}>
                <ConverterSettingsPanel
                    outputFormat={outputFormat}
                    setOutputFormat={(v) => updateSettings('outputFormat', v)}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={(v) => updateSettings('backgroundColor', v)}
                    keepTransparency={keepTransparency}
                    setKeepTransparency={(v) => updateSettings('keepTransparency', v)}
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
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors disabled:bg-zinc-900 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:focus:ring-offset-zinc-900"
                >
                    <TrashIcon className="w-5 h-5" />
                    {t('clearSelection')}
                </button>
            </ToolSection>
            
            <ToolSection title={t('convertAndDownload')}>
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
                        {!isProcessing && (
                            <button
                                onClick={handleConvertAndDownload}
                                disabled={isGenerateDisabled}
                                className="w-full flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                            >
                                <DownloadIcon className="w-6 h-6" />
                                {t('convertAndDownload')} {files.length > 0 ? `(${files.length})` : ''} {t('images')}
                            </button>
                        )}
                    </>
                )}
            </ToolSection>
         </div>
    );
};

export default ImageConverter;
