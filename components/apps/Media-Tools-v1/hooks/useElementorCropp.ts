
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { createWorker, ELEMENTOR_CROPP_WORKER_CODE, trimImage } from '../utils';
import { generateSmartName } from '../utils/seo';

export type ResizeMode = 'custom' | 'original' | 'fixed-width';
export type SeparatorType = '-' | '_' | ' ' | '.';
export type RenameMode = 'base' | 'smart';

const FILE_LIMIT = 150;
const MAX_DIMENSION = 8000;

export const useElementorCropp = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    
    // State
    const [files, setFiles] = useState<File[]>([]);
    const [padding, setPadding] = useState(0);
    const [width, setWidth] = useState(1080);
    const [height, setHeight] = useState(1080);
    const [trim, setTrim] = useState(true);
    const [baseName, setBaseName] = useState('');
    const [resizeMode, setResizeMode] = useState<ResizeMode>('custom');
    const [renameMode, setRenameMode] = useState<RenameMode>('smart');
    const [isLinked, setIsLinked] = useState(true); 
    const [previewIndex, setPreviewIndex] = useState(0);
    const [nameSeparator, setNameSeparator] = useState<SeparatorType>(' ');
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedFilesCount, setProcessedFilesCount] = useState(0);
    
    // Preview Logic
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handlers
    const handleFilesAdd = useCallback((newFiles: File[]) => {
        const pngFiles = newFiles.filter(f => f.type === 'image/png');
        if (pngFiles.length < newFiles.length) {
            addToast(t('transparentPngsOnly'), 'warning');
        }
        setFiles(prev => {
            const combined = [...prev, ...pngFiles];
             if (combined.length > FILE_LIMIT) {
                addToast(t('fileLimitExceeded', { limit: FILE_LIMIT }), 'warning');
                return combined.slice(0, FILE_LIMIT);
            }
            return combined;
        });
        if (files.length === 0) setPreviewIndex(0);
        setIsProcessing(false);
        setProcessedFilesCount(0);
    }, [addToast, t, files.length]);

    const handleFileRemove = useCallback((idx: number) => {
        setFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== idx);
            if (previewIndex >= newFiles.length) {
                setPreviewIndex(Math.max(0, newFiles.length - 1));
            }
            return newFiles;
        });
        setIsProcessing(false);
        setProcessedFilesCount(0);
    }, [previewIndex]);

    const handleReset = useCallback(() => {
        setFiles([]);
        setPreviewIndex(0);
        setBaseName('');
        setIsProcessing(false);
        setProgress(0);
        setProcessedFilesCount(0);
        addToast(t('allFilesCleared'), 'success');
    }, [addToast, t]);

    const handleDimensionChange = useCallback((dimension: 'width' | 'height', value: number) => {
        const clampedValue = Math.max(1, Math.min(MAX_DIMENSION, value));

        if (isLinked && resizeMode === 'custom' && width > 0 && height > 0) {
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
    }, [isLinked, resizeMode, width, height]);

    const handleNextPreview = useCallback(() => {
        if (files.length === 0) return;
        setPreviewIndex(prev => (prev + 1) % files.length);
    }, [files.length]);

    const handlePrevPreview = useCallback(() => {
        if (files.length === 0) return;
        setPreviewIndex(prev => (prev - 1 + files.length) % files.length);
    }, [files.length]);

    const handleProcess = useCallback(async () => {
        if (!files.length) return;
        setIsProcessing(true);
        setProgress(0);
        setProcessedFilesCount(0);

        try {
            const workerUrl = createWorker(ELEMENTOR_CROPP_WORKER_CODE);
            const worker = new Worker(workerUrl);
            
            worker.onmessage = (e) => {
                const { status, blob, progress: p, error, processedCount } = e.data;
                if (status === 'progress') {
                    setProgress(p);
                    setProcessedFilesCount(processedCount);
                } else if (status === 'complete') {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = t('croppZipName');
                    link.click();
                    setIsProcessing(false);
                    addToast(t('downloadStarted'), 'success');
                    worker.terminate();
                } else if (status === 'error') {
                    console.error(error);
                    addToast(t('errorProcessingFiles'), 'error');
                    setIsProcessing(false);
                    worker.terminate();
                }
            };

            worker.postMessage({
                files,
                settings: { 
                    width, 
                    height, 
                    padding, 
                    trim, 
                    baseName: renameMode === 'base' ? baseName : '', 
                    resizeMode,
                    renameMode,
                    separator: nameSeparator
                }
            });
        } catch (e) {
            console.error(e);
            setIsProcessing(false);
        }
    }, [files, width, height, padding, trim, baseName, resizeMode, renameMode, nameSeparator, t, addToast]);

    const updatePreview = useCallback(async () => {
        if (!files.length || !canvasRef.current) return;
        const safeIndex = Math.min(previewIndex, files.length - 1);
        const file = files[safeIndex];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let srcCanvas: HTMLCanvasElement | HTMLImageElement = img;
            if (trim) {
                const trimmed = trimImage(img);
                if (trimmed) srcCanvas = trimmed;
            }

            const srcW = srcCanvas.width;
            const srcH = srcCanvas.height;
            let finalW = width;
            let finalH = height;

            if (resizeMode === 'original') {
                finalW = srcW + (padding * 2);
                finalH = srcH + (padding * 2);
            } else if (resizeMode === 'fixed-width') {
                finalW = width;
                const availableW = Math.max(1, finalW - (padding * 2));
                const scale = availableW / srcW;
                finalH = Math.round((srcH * scale) + (padding * 2));
            }

            canvas.width = finalW;
            canvas.height = finalH;
            ctx.clearRect(0, 0, finalW, finalH);

            const availW = finalW - (padding * 2);
            const availH = finalH - (padding * 2);
            const safeAvailW = Math.max(1, availW);
            const safeAvailH = Math.max(1, availH);
            const scale = Math.min(safeAvailW / srcW, safeAvailH / srcH);
            const drawW = srcW * scale;
            const drawH = srcH * scale;
            const x = (finalW - drawW) / 2;
            const y = (finalH - drawH) / 2;

            ctx.drawImage(srcCanvas, x, y, drawW, drawH);

            if (padding > 0) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.fillRect(0, 0, finalW, padding);
                ctx.fillRect(0, finalH - padding, finalW, padding);
                ctx.fillRect(0, padding, padding, finalH - (padding * 2));
                ctx.fillRect(finalW - padding, padding, padding, finalH - (padding * 2));
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(padding, padding, finalW - (padding * 2), finalH - (padding * 2));
            }
            URL.revokeObjectURL(img.src);
        };
    }, [files, width, height, padding, trim, resizeMode, previewIndex]);

    const getPreviewName = useCallback(() => {
        if (!files[previewIndex]) return '';
        if (renameMode === 'smart') {
            return generateSmartName(files[previewIndex].name, nameSeparator) + '.png';
        }
        return baseName ? `${baseName}-${previewIndex + 1}.png` : files[previewIndex].name;
    }, [files, previewIndex, renameMode, baseName, nameSeparator]);

    // Effects
    useEffect(() => {
        if (files.length > 0 && renameMode === 'base' && !baseName) {
            const currentFile = files[previewIndex] || files[0];
            const smartName = generateSmartName(currentFile.name, nameSeparator);
            setBaseName(smartName);
        }
    }, [files, previewIndex, nameSeparator, renameMode, baseName]);

    useEffect(() => {
        updatePreview();
    }, [updatePreview]);

    return {
        // State
        files, padding, width, height, trim, baseName, resizeMode, renameMode, isLinked, previewIndex, nameSeparator, isProcessing, progress, processedFilesCount,
        // Setters & Handlers
        setPadding, setWidth, setHeight, setTrim, setBaseName, setResizeMode, setRenameMode, setIsLinked, setPreviewIndex, setNameSeparator,
        handleFilesAdd, handleFileRemove, handleReset, handleDimensionChange, handleNextPreview, handlePrevPreview, handleProcess,
        // Refs
        canvasRef,
        // Derived Values / Functions
        t, getPreviewName
    };
};
