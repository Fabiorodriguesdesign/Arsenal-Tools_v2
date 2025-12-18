import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TrashIcon } from '../icons';

interface OptimizerPreviewProps {
    file: File;
    settings: {
        quality: number;
        maxWidth: number;
        maxHeight: number;
        isResizingEnabled: boolean;
    };
    onOptimizedSizeChange: (size: number | null) => void;
    t: (key: string) => string;
}

const OptimizerPreview: React.FC<OptimizerPreviewProps> = ({ file, settings, onOptimizedSizeChange, t }) => {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const previewSliderRef = useRef<HTMLInputElement>(null);

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });

    const [originalImageBitmap, setOriginalImageBitmap] = useState<ImageBitmap | null>(null);
    const [optimizedImageBitmap, setOptimizedImageBitmap] = useState<ImageBitmap | null>(null);

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        if (previewSliderRef.current) {
            previewSliderRef.current.value = '50';
        }
    }, []);

    // Reset view when the file changes
    useEffect(() => {
        resetView();
    }, [file, resetView]);

    const draw = useCallback(() => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const sliderValue = previewSliderRef.current ? Number(previewSliderRef.current.value) : 50;

        const { width: canvasWidth, height: canvasHeight } = canvas;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        if (originalImageBitmap) {
            const drawWidth = canvasWidth / zoom;
            const drawHeight = canvasHeight / zoom;
            ctx.drawImage(originalImageBitmap, 0, 0, drawWidth, drawHeight);
        }

        if (optimizedImageBitmap) {
            const drawWidth = canvasWidth / zoom;
            const drawHeight = canvasHeight / zoom;
            const clipX = (sliderValue / 100) * drawWidth;

            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, clipX, drawHeight);
            ctx.clip();
            ctx.drawImage(optimizedImageBitmap, 0, 0, drawWidth, drawHeight);
            ctx.restore();

            ctx.strokeStyle = '#ff0e00';
            ctx.lineWidth = 2 / zoom;
            ctx.beginPath();
            ctx.moveTo(clipX, 0);
            ctx.lineTo(clipX, drawHeight);
            ctx.stroke();
        }

        ctx.restore();
    }, [originalImageBitmap, optimizedImageBitmap, zoom, pan]);

    useEffect(() => {
        draw();
    }, [draw]);

    useEffect(() => {
        let isCancelled = false;

        const loadAndOptimize = async () => {
            if (!file) {
                setOriginalImageBitmap(prev => { prev?.close(); return null; });
                setOptimizedImageBitmap(prev => { prev?.close(); return null; });
                onOptimizedSizeChange(null);
                return;
            }

            let newOriginalBitmap: ImageBitmap | null = null;
            let newOptimizedBitmap: ImageBitmap | null = null;

            try {
                newOriginalBitmap = await createImageBitmap(file);
                if (isCancelled) {
                    newOriginalBitmap?.close();
                    return;
                }

                let { width, height } = newOriginalBitmap;
                const { isResizingEnabled, maxWidth, maxHeight, quality } = settings;

                if (isResizingEnabled && (width > maxWidth || height > maxHeight)) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                if (width <= 0 || height <= 0) {
                     throw new Error("Invalid image dimensions for processing.");
                }

                const offscreenCanvas = new OffscreenCanvas(width, height);
                const offscreenCtx = offscreenCanvas.getContext('2d');
                if (!offscreenCtx) throw new Error('Failed to get offscreen canvas context.');

                offscreenCtx.drawImage(newOriginalBitmap, 0, 0, width, height);
                const optimizedBlob = await offscreenCanvas.convertToBlob({ type: 'image/jpeg', quality: quality / 100 });
                
                if (isCancelled) {
                    newOriginalBitmap?.close();
                    return;
                }
                onOptimizedSizeChange(optimizedBlob.size);
                
                newOptimizedBitmap = await createImageBitmap(optimizedBlob);
                if (isCancelled) {
                    newOriginalBitmap?.close();
                    newOptimizedBitmap?.close();
                    return;
                }

                setOriginalImageBitmap(prev => {
                    if (prev && prev !== newOriginalBitmap) prev.close();
                    return newOriginalBitmap;
                });
                setOptimizedImageBitmap(prev => {
                    if (prev && prev !== newOptimizedBitmap) prev.close();
                    return newOptimizedBitmap;
                });

            } catch (error) {
                console.error("Error loading or optimizing preview:", error);
                onOptimizedSizeChange(null);
                newOriginalBitmap?.close();
                newOptimizedBitmap?.close();
                setOriginalImageBitmap(prev => { prev?.close(); return null; });
                setOptimizedImageBitmap(prev => { prev?.close(); return null; });
            }
        };

        const debounceTimer = setTimeout(loadAndOptimize, 300);

        return () => {
            isCancelled = true;
            clearTimeout(debounceTimer);
        };
    }, [file, settings, onOptimizedSizeChange]);
    
    // Final cleanup on unmount
    useEffect(() => {
        return () => {
            setOriginalImageBitmap(prev => {
                prev?.close();
                return null;
            });
            setOptimizedImageBitmap(prev => {
                prev?.close();
                return null;
            });
        };
    }, []);

    useEffect(() => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;
        const parentRect = canvas.parentElement?.getBoundingClientRect();
        if (parentRect) {
            canvas.width = parentRect.width;
            canvas.height = parentRect.height;
        }
        draw();
    }, [draw]);


    const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        const scaleAmount = 1.1;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - pan.x) / zoom;
        const worldY = (mouseY - pan.y) / zoom;

        let newZoom = zoom;
        if (e.deltaY < 0) newZoom *= scaleAmount;
        else newZoom /= scaleAmount;
        newZoom = Math.max(0.1, Math.min(newZoom, 10));

        setZoom(newZoom);
        setPan({
            x: mouseX - worldX * newZoom,
            y: mouseY - worldY * newZoom
        });
    }, [zoom, pan]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }, [isDragging]);

    const handleMouseUpOrLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div className="relative w-full aspect-video bg-zinc-950/50 rounded-md flex items-center justify-center p-2 border border-zinc-800">
            {file ? (
                <>
                    <canvas
                        ref={previewCanvasRef}
                        className="max-w-full max-h-full h-auto w-auto object-contain rounded-sm cursor-grab active:cursor-grabbing"
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUpOrLeave}
                        onMouseLeave={handleMouseUpOrLeave}
                        aria-label={t('optimizerPreviewImage')}
                    />
                    {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
                        <button
                            onClick={resetView}
                            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                            aria-label={t('resetView')}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                    <input
                        ref={previewSliderRef}
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        className="absolute inset-0 w-full h-full cursor-col-resize opacity-0"
                        aria-label={t('compareBeforeAfter')}
                        onInput={draw}
                    />
                </>
            ) : (
                <div className="text-sm text-zinc-500">{t('loadingPreview')}</div>
            )}
        </div>
    );
};

export default OptimizerPreview;