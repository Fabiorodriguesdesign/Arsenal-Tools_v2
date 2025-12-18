
import { useState, useCallback, useEffect, useMemo } from 'react';
import { AspectRatio, OutputFormat } from '../types';
import { saveState, loadState } from '../utils';
import { useToast } from '../contexts/ToastContext';
import { generateSingleImageWithBackground, generateBatchImagesWithBackground } from '../services/imageProcessor';
import { useLanguage } from '../contexts/LanguageContext';

const FILE_LIMIT = 150;
type SeparatorType = '-' | '_' | ' ' | '.';
type RenameMode = 'base' | 'smart';

export const useBackgroundProcessing = () => {
    const { addToast } = useToast();
    const { t } = useLanguage();

    const [background, setBackground] = useState<File | null>(null);
    const [foregrounds, setForegrounds] = useState<File[]>([]);
    
    const [settings, setSettings] = useState(() => loadState('backgroundMasterSettings_v2', {
        aspectRatio: '1:1' as AspectRatio,
        width: 1080,
        height: 1080,
        outputFormat: 'jpeg' as OutputFormat,
        isDimensionsLinked: true,
        padding: 0,
        renameMode: 'base' as RenameMode,
        baseName: '',
        separator: ' ' as SeparatorType,
        trim: true,
        keepOriginalName: true 
    }));

    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    const [failedFiles, setFailedFiles] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        saveState('backgroundMasterSettings_v2', settings);
    }, [settings]);

    // Derived URLs
    const backgroundUrl = useMemo(() => background ? URL.createObjectURL(background) : null, [background]);
    const currentForegroundUrl = useMemo(() => foregrounds.length > 0 ? URL.createObjectURL(foregrounds[currentPreviewIndex]) : null, [foregrounds, currentPreviewIndex]);

    // Cleanup URLs
    useEffect(() => {
        return () => {
            if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
        };
    }, [backgroundUrl]);

    useEffect(() => {
        return () => {
            if (currentForegroundUrl) URL.revokeObjectURL(currentForegroundUrl);
        };
    }, [currentForegroundUrl]);

    // Auto-adjust format for single file
    useEffect(() => {
        if (foregrounds.length === 1 && settings.outputFormat === 'zip') {
            setSettings(s => ({ ...s, outputFormat: 'jpeg' }));
        }
    }, [foregrounds, settings.outputFormat]);

    // Settings Setters
    const setAspectRatio = useCallback((ratio: AspectRatio) => setSettings(s => ({ ...s, aspectRatio: ratio })), []);
    const setWidth = useCallback((w: number) => setSettings(s => ({ ...s, width: w })), []);
    const setHeight = useCallback((h: number) => setSettings(s => ({ ...s, height: h })), []);
    const setOutputFormat = useCallback((format: OutputFormat) => setSettings(s => ({ ...s, outputFormat: format })), []);
    const setIsDimensionsLinked = useCallback((isLinked: boolean) => setSettings(s => ({ ...s, isDimensionsLinked: isLinked })), []);
    const setPadding = useCallback((p: number) => setSettings(s => ({ ...s, padding: p })), []);
    const setTrim = useCallback((val: boolean) => setSettings(s => ({ ...s, trim: val })), []);
    const setRenameMode = useCallback((mode: RenameMode) => setSettings(s => ({...s, renameMode: mode})), []);
    const setBaseName = useCallback((name: string) => setSettings(s => ({...s, baseName: name})), []);
    const setSeparator = useCallback((sep: SeparatorType) => setSettings(s => ({...s, separator: sep})), []);
    const setKeepOriginalName = useCallback((val: boolean) => setSettings(s => ({ ...s, keepOriginalName: val })), []);

    // File Handlers
    const handleBackgroundAdd = useCallback((files: File[]) => {
        setBackground(files[0] || null);
        setIsCompleted(false);
        setProcessedFilesCount(0);
    }, []);

    const handleBackgroundClear = useCallback(() => {
        setBackground(null);
    }, []);

    const handleForegroundsAdd = useCallback((newFiles: File[]) => {
        setForegrounds(currentFiles => {
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
        setCurrentPreviewIndex(0);
        setIsCompleted(false);
        setProcessedFilesCount(0);
    }, [addToast, t]);

    const handleForegroundRemove = useCallback((index: number) => {
        setForegrounds(currentFiles => {
            const updatedFiles = currentFiles.filter((_, i) => i !== index);
            setCurrentPreviewIndex(prev => prev >= updatedFiles.length ? 0 : prev);
            return updatedFiles;
        });
        setIsCompleted(false);
        setProcessedFilesCount(0);
    }, []);

    const handleForegroundsClear = useCallback(() => {
        setForegrounds([]);
        setIsCompleted(false);
        setProcessedFilesCount(0);
    }, []);

    const handleNextPreview = useCallback(() => {
        if (foregrounds.length === 0) return;
        setCurrentPreviewIndex(prev => (prev + 1) % foregrounds.length);
    }, [foregrounds.length]);

    const handlePrevPreview = useCallback(() => {
        if (foregrounds.length === 0) return;
        setCurrentPreviewIndex(prev => (prev - 1 + foregrounds.length) % foregrounds.length);
    }, [foregrounds.length]);

    const handleClearAll = useCallback(() => {
        setBackground(null);
        setForegrounds([]);
        setCurrentPreviewIndex(0);
        setFailedFiles([]);
        setIsCompleted(false);
        setProcessedFilesCount(0);
        localStorage.removeItem('mediaTools_backgroundMasterSettings_v2');
        setSettings({
            aspectRatio: '1:1', width: 1080, height: 1080,
            outputFormat: 'jpeg', isDimensionsLinked: true, padding: 0,
            renameMode: 'base', baseName: '', separator: ' ', trim: true, keepOriginalName: true
        });
    }, []);

    // Generation Logic
    const handleGenerateSingleImage = useCallback(async () => {
        if (!background || foregrounds.length !== 1) return;

        setIsProcessing(true);
        setFailedFiles([]);
        setProcessedFilesCount(0);

        try {
            const result = await generateSingleImageWithBackground(
                background,
                foregrounds[0],
                settings,
                (p) => {
                    setProgress(p);
                    if (p === 100) setProcessedFilesCount(1);
                    else setProcessedFilesCount(0);
                }
            );

            if (result.blob) {
                const link = document.createElement('a');
                const fileUrl = URL.createObjectURL(result.blob);
                link.href = fileUrl;
                link.download = `${result.fileName}.${result.extension}`; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(fileUrl);
                addToast(t('downloadStarted'), 'success');
                setForegrounds([]);
                setIsCompleted(true);
            } else {
                setFailedFiles([result.fileName]);
            }
        } catch (error: any) {
            addToast(t(error.message) || t('unexpectedErrorProcessing'), 'error');
        } finally {
            setIsProcessing(false);
        }
    }, [background, foregrounds, settings, addToast, t]);

    const handleGenerateBatch = useCallback(async () => {
        if (!background || foregrounds.length === 0) {
            addToast(t('selectBackgroundAndPNG'), 'warning');
            return;
        }

        setIsProcessing(true);
        const processingErrors: string[] = [];
        setFailedFiles([]);
        setProcessedFilesCount(0);

        try {
            const zipBlob = await generateBatchImagesWithBackground(
                background,
                foregrounds,
                settings,
                (p, processed, total) => {
                    setProgress(p);
                    setProcessedFilesCount(processed);
                },
                (fileName) => processingErrors.push(fileName)
            );

            setFailedFiles(processingErrors);

            if (zipBlob) {
                const link = document.createElement('a');
                const zipUrl = URL.createObjectURL(zipBlob);
                link.href = zipUrl;
                link.download = t('backgroundMasterZipName');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(zipUrl);
                addToast(t('downloadStarted'), 'success');
                setForegrounds([]);
                setIsCompleted(true);
            } else if (processingErrors.length === foregrounds.length) {
                addToast(t('allFilesFailed'), 'error');
            }

        } catch (error: any) {
            addToast(t(error.message) || t('unexpectedErrorProcessing'), 'error');
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    }, [background, foregrounds, settings, addToast, t]);

    const handleGenerate = useCallback(() => {
        if (foregrounds.length > 1) {
            handleGenerateBatch();
        } else {
            handleGenerateSingleImage();
        }
    }, [foregrounds.length, handleGenerateBatch, handleGenerateSingleImage]);

    return {
        background,
        foregrounds,
        settings,
        currentPreviewIndex,
        backgroundUrl,
        currentForegroundUrl,
        isProcessing,
        progress,
        processedFilesCount,
        failedFiles,
        isCompleted,
        
        setAspectRatio,
        setWidth,
        setHeight,
        setOutputFormat,
        setIsDimensionsLinked,
        setPadding,
        setTrim,
        setRenameMode,
        setBaseName,
        setSeparator,
        setKeepOriginalName,

        handleBackgroundAdd,
        handleBackgroundClear,
        handleForegroundsAdd,
        handleForegroundRemove,
        handleForegroundsClear,
        handleNextPreview,
        handlePrevPreview,
        handleClearAll,
        handleGenerate
    };
};
