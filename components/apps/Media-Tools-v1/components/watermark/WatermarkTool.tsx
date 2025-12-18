
import React, { useState, useCallback, useEffect } from 'react';
import FileUpload from '../FileUpload';
import { DownloadIcon, TrashIcon, ShieldCheckIcon } from '../icons';
import { useToast } from '../../contexts/ToastContext';
import { saveState, loadState, createWorker, WATERMARK_WORKER_CODE } from '../../utils';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressDisplay from '../common/ProgressDisplay';
import CompletionMessage from '../common/CompletionMessage';
import ErrorAlert from '../common/ErrorAlert';
import WatermarkPreview from './WatermarkPreview';
import { WatermarkSettings, Position, WatermarkType } from './types';
import WatermarkInput from './WatermarkInput';
import WatermarkSettingsPanel from './WatermarkSettingsPanel';
import ToolSection from '../common/ToolSection';
import SeoTagsGenerator from '../common/SeoTagsGenerator';
import { generateSmartName } from '../../utils/seo';
import OutputSettingsPanel from '../common/OutputSettingsPanel';

declare var JSZip: any;

const FILE_LIMIT = 100;
type RenameMode = 'base' | 'smart';
type SeparatorType = '-' | '_' | ' ' | '.';

const WatermarkTool: React.FC = () => {
    const { t, language } = useLanguage();
    const [images, setImages] = useState<File[]>([]);
    const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);

    // Settings State with Persistence
    const [settings, setSettings] = useState<WatermarkSettings>(() => {
        const savedSettings = loadState('watermarkToolSettings', {
            position: 'bottom-right' as Position,
            scale: 15,
            opacity: 70,
            margin: 2,
            isRepeating: false,
            spacing: 10,
            rotation: -45,
            watermarkType: 'image' as WatermarkType,
            text: '',
            fontFamily: 'Poppins',
            fontSize: 50,
            textColor: '#FFFFFF',
            isStrokeEnabled: false,
            strokeColor: '#000000',
            strokeWidth: 5,
        });
        if (savedSettings.text === '') {
            savedSettings.text = language === 'pt' ? 'Sua Marca d\'Água' : 'Your Watermark';
        }
        return savedSettings;
    });

    // Renaming State
    const [renameMode, setRenameMode] = useState<RenameMode>('smart');
    const [baseName, setBaseName] = useState('');
    const [separator, setSeparator] = useState<SeparatorType>(' ');

    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    const [failedFiles, setFailedFiles] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [textError, setTextError] = useState<string | null>(null);
    const { addToast } = useToast();
    
    // Persistence Effect
    useEffect(() => {
        saveState('watermarkToolSettings', settings);
    }, [settings]);

    // Localize default text if needed
    useEffect(() => {
        const defaultPt = 'Sua Marca d\'Água';
        const defaultEn = 'Your Watermark';
        if (settings.text === defaultPt || settings.text === defaultEn || settings.text === '') {
            setSettings(s => ({...s, text: t('yourWatermark')}));
        }
    }, [language, t, settings.text]);

    // Auto-fill baseName for display only in base mode
    useEffect(() => {
        if (images.length > 0 && renameMode === 'base' && !baseName) {
            const currentFile = images[0];
            const smartName = generateSmartName(currentFile.name, separator);
            setBaseName(smartName);
        }
    }, [images, separator, renameMode, baseName]);

    const setSettingsState = useCallback((newSettings: Partial<WatermarkSettings>) => {
        setSettings(s => ({ ...s, ...newSettings }));
        if (newSettings.text !== undefined && textError) {
            setTextError(null);
        }
    }, [textError]);

    const handleImagesAdd = useCallback((newFiles: File[]) => {
        const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
        setImages(currentFiles => {
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
    }, [addToast, t]);
    
    const handleImageRemove = useCallback((index: number) => {
        setImages(currentFiles => currentFiles.filter((_, i) => i !== index));
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
    }, []);

    const handleWatermarkAdd = useCallback((files: File[]) => {
        setWatermarkImageFile(files[0] || null);
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
    }, []);

    const handleWatermarkClear = useCallback(() => {
        setWatermarkImageFile(null);
        setIsCompleted(false);
        setProcessedFilesCount(0);
        setFailedFiles([]);
    }, []);

    const handleClearAll = useCallback(() => {
        setImages([]);
        setWatermarkImageFile(null);
        setFailedFiles([]);
        setIsCompleted(false);
        setProcessedFilesCount(0);
        localStorage.removeItem('mediaTools_watermarkToolSettings');
        setSettings({ 
            position: 'bottom-right', scale: 15, opacity: 70, margin: 2, 
            isRepeating: false, spacing: 10, rotation: -45,
            watermarkType: 'image', text: t('yourWatermark'), fontFamily: 'Poppins',
            fontSize: 50, textColor: '#FFFFFF',
            isStrokeEnabled: false, strokeColor: '#000000', strokeWidth: 5
        });
        setTextError(null);
        setBaseName('');
    }, [t]);

    const handleApplyAndDownload = useCallback(async () => {
        if (images.length === 0) return;
        if (settings.watermarkType === 'image' && !watermarkImageFile) {
            addToast(t('selectWatermarkImage'), "error");
            return;
        }
        if (settings.watermarkType === 'text' && !settings.text.trim()) {
            setTextError(t('enterWatermarkText'));
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setProcessedFilesCount(0);
        setFailedFiles([]);
        setIsCompleted(false);
        
        let worker: Worker | null = null;
        try {
            const workerUrl = createWorker(WATERMARK_WORKER_CODE);
            worker = new Worker(workerUrl);
            URL.revokeObjectURL(workerUrl);
        } catch (error) {
            console.error(`${t('workerError')}:`, error);
            addToast(t('errorProcessingFiles'), 'error');
            setIsProcessing(false);
            return;
        }
        
        const zip = new JSZip();
        const localFailedFiles: string[] = [];
        let successfulFiles = 0;

        worker.onmessage = (e: MessageEvent) => {
            const { status, blob, originalFileName, error, processedCount: workerProcessedCount, totalFiles: workerTotalFiles } = e.data;
            
            if (status === 'progress' || status === 'error') {
                setProcessedFilesCount(workerProcessedCount);
                if (status === 'progress' && blob) {
                    
                    // Naming Logic
                    let fileName;
                    if (renameMode === 'smart') {
                        const smartName = generateSmartName(originalFileName, separator);
                        fileName = `${smartName}.jpg`;
                    } else if (baseName && baseName.trim() !== '') {
                        fileName = `${baseName.trim()}-${successfulFiles + 1}.jpg`;
                    } else {
                        const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
                        fileName = `${nameWithoutExt}_wm.jpg`;
                    }
                    
                    if (zip.file(fileName)) {
                        const parts = fileName.split('.');
                        const ext = parts.pop();
                        const base = parts.join('.');
                        fileName = `${base}_${successfulFiles + 1}.${ext}`;
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
                worker?.terminate();
                setFailedFiles(localFailedFiles);
                if (Object.keys(zip.files).length > 0) {
                    zip.generateAsync({ type: 'blob' }).then((zipBlob: Blob) => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(zipBlob);
                        link.download = t('watermarkedImagesZipName');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(link.href);
                        addToast(t('downloadStarted'), 'success');
                        setImages([]);
                        setIsCompleted(true);
                    });
                } else if (localFailedFiles.length === images.length) {
                     addToast(t('allFilesFailed'), 'error');
                } else {
                     addToast(t('noImagesProcessed'), 'error');
                }
                setIsProcessing(false);
                setProgress(0);
            }
        };
        
        worker.onerror = (e) => {
            addToast(t('unexpectedErrorProcessing'), 'error');
            setIsProcessing(false);
            worker?.terminate();
        };

        worker.postMessage({ images, watermarkImageFile, settings });

    }, [images, watermarkImageFile, settings, renameMode, baseName, separator, addToast, t]);

    const isGenerateDisabled = images.length === 0 || isProcessing || (settings.watermarkType === 'image' && !watermarkImageFile) || (settings.watermarkType === 'text' && !settings.text.trim());
    const isClearDisabled = images.length === 0 && !watermarkImageFile && settings.text === t('yourWatermark') && !isCompleted;

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Uploads */}
                <div className="flex flex-col gap-6">
                    <ToolSection title={t('selectImages')}>
                        <FileUpload
                            title={t('selectImages')}
                            description={t('anyImageFile')}
                            onFilesAdd={handleImagesAdd}
                            onFileRemove={handleImageRemove}
                            onFilesClear={() => setImages([])}
                            acceptedFormats="image/*"
                            isMultiple={true}
                            uploadedFile={images}
                            icon={<ShieldCheckIcon className="w-10 h-10 text-zinc-600" />}
                        />
                    </ToolSection>
                    
                    <ToolSection title={t('watermarkSource')}>
                         <WatermarkInput
                            watermarkType={settings.watermarkType}
                            watermarkImageFile={watermarkImageFile}
                            textSettings={settings}
                            textError={textError}
                            setSettingsState={setSettingsState}
                            handleWatermarkAdd={handleWatermarkAdd}
                            handleWatermarkClear={handleWatermarkClear}
                            t={t}
                        />
                    </ToolSection>
                </div>

                {/* Right Column: Preview & Settings */}
                <div className="flex flex-col gap-6">
                    {images.length > 0 && (
                        <ToolSection title={t('preview')}>
                             <WatermarkPreview 
                                mainImageFile={images[0]}
                                watermarkImageFile={watermarkImageFile}
                                settings={settings}
                                t={t}
                             />
                        </ToolSection>
                    )}
                    
                    <ToolSection title={t('watermarkSettings')}>
                        <WatermarkSettingsPanel
                            settings={settings}
                            setSettingsState={setSettingsState}
                            t={t}
                        />
                    </ToolSection>
                </div>
            </div>
            
            <div className="flex flex-col gap-6">
                <ToolSection title={t('outputSettings')}>
                    <OutputSettingsPanel 
                        renameMode={renameMode}
                        setRenameMode={setRenameMode}
                        baseName={baseName}
                        setBaseName={setBaseName}
                        separator={separator}
                        setSeparator={setSeparator}
                        t={t}
                     />
                </ToolSection>

                {images.length > 0 && <SeoTagsGenerator files={images} t={t} />}

                <ToolSection title={t('applyAndDownload')}>
                    {isCompleted ? (
                        <CompletionMessage onClear={handleClearAll} t={t} />
                    ) : (
                        <>
                            {isProcessing && (
                                <div className="mb-4">
                                    <ProgressDisplay progress={progress} processedCount={processedFilesCount} totalFiles={images.length} t={t} />
                                </div>
                            )}
                            <ErrorAlert failedFiles={failedFiles} t={t} />
                            
                             <div className="flex gap-3">
                                <button
                                    onClick={handleClearAll}
                                    disabled={isClearDisabled}
                                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-3 px-4 rounded-lg hover:bg-zinc-700 transition-colors disabled:bg-zinc-900 disabled:text-zinc-500 disabled:cursor-not-allowed"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    {t('clearSelection')}
                                </button>
                                <button
                                    onClick={handleApplyAndDownload}
                                    disabled={isGenerateDisabled}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff0e00] dark:focus:ring-offset-zinc-900 shadow-lg shadow-[#ff0e00]/20"
                                >
                                    <DownloadIcon className="w-6 h-6" />
                                    {isProcessing ? `${t('processing')}...` : `${t('applyAndDownload')} ${images.length > 0 ? `(${images.length})` : ''}`}
                                </button>
                            </div>
                        </>
                    )}
                </ToolSection>
            </div>
        </div>
    );
};

export default WatermarkTool;
